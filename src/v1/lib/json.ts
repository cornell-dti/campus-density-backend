/* JSON Parsing Utility */

/* rockon999 // Evan Welsh */

/* globals Symbol */
const jsonobj = Symbol('jsonobj');

type TypeFunc = (val: JSONDoc | JSONDoc[]) => boolean;

export interface TypeDef {
  nullable?: boolean;
  optional?: boolean;
  parse?: (obj: JSONDoc | JSONDoc[]) => any;
  type: TypeFunc | symbol | string;
  json?: Function;
}

export interface DynamicTypeDef extends TypeDef {
  type(json: JSONDoc): boolean;
}

export interface StaticTypeDef extends TypeDef {
  type: string;
}

export interface TypeDefFactory {
  new <K>(): K;
  from<K extends TypeDef>(constructor: K, optional: boolean): K;
}

export class OptionalTypeDef {
  optional: boolean;

  constructor(optional: boolean = false) {
    this.optional = optional;
  }
}

export class EnumTypeDef<K> extends OptionalTypeDef implements TypeDef {
  enumValues: any[];

  constructor(enumDef: K, optional: boolean = false) {
    super(optional);
    this.enumValues = Object.values(enumDef);
  }

  type(val: JSONDoc): boolean {
    return this.enumValues.indexOf(val) !== -1;
  }

  parse(val: JSONDoc): K {
    return (val as unknown) as K;
  }
}

export class PrimitiveArrayTypeDef extends OptionalTypeDef implements DynamicTypeDef {
  primitiveType: string;

  constructor(primitiveType: 'number' | 'boolean' | 'string', optional: boolean = false) {
    super(optional);
    this.primitiveType = primitiveType;
  }

  type(val: JSONDoc): boolean {
    return Array.isArray(val) && val.every(v => typeof v === this.primitiveType); // eslint-disable-line valid-typeof
  }
}

export class ArrayTypeDef<K extends JSONObject> extends OptionalTypeDef implements DynamicTypeDef {
  private constr: (data: JSONDoc) => K;

  constructor(constructor: Constructable<K> & { fromJSON(data: JSONDoc): K }, optional: boolean = false) {
    super(optional);

    this.constr = data => constructor.fromJSON(data);
  }

  type(val: JSONDoc): boolean {
    return Array.isArray(val);
  }

  parse(json: JSONDoc[] = []): K[] {
    return json.map((j: JSONDoc) => this.constr(j));
  }
}

export class MapTypeDef<K extends JSONObject> implements DynamicTypeDef {
  arrayTypeDef: ArrayTypeDef<K>;
  key: string;

  constructor(constructor: Constructable<K> & { fromJSON(data: JSONDoc): K }, key: string, optional: boolean = false) {
    this.key = key;
    this.arrayTypeDef = new ArrayTypeDef(constructor, optional);
  }

  type(val): boolean {
    return this.arrayTypeDef.type.call(this.arrayTypeDef, val) && this.key && val.every(v => this.key in v);
  }

  json(map: Map<string, K>): K[] {
    return Array.from(map.values());
  }

  parse(json: JSONDoc[] = []): Map<string, K> {
    return new /* eslint-disable-line no-undef */ Map(
      this.arrayTypeDef.parse(json).map(item => [item[this.key], item] as [string, K])
    );
  }
}

export class JSONObjectTypeDef<K extends JSONObject> extends OptionalTypeDef implements StaticTypeDef {
  type = 'object';

  private constr: (data) => K;

  constructor(constructor: Constructable<K> & { fromJSON(data: JSONDoc): K }, optional: boolean = false) {
    super(optional);

    this.constr = data => constructor.fromJSON(data);
  }

  parse(json: JSONDoc) {
    return this.constr(json);
  }
}

function isTypeDef(obj: any): obj is TypeDef {
  return (
    typeof obj === 'object' &&
    (typeof obj.optional === 'boolean' || typeof obj.optional === 'undefined') &&
    (typeof obj.nullable === 'boolean' || typeof obj.nullable === 'undefined') &&
    (typeof obj.parse === 'function' || typeof obj.parse === 'undefined') &&
    (typeof obj.json === 'function' || typeof obj.json === 'undefined') &&
    ('type' in obj && (typeof obj.type === 'function' || typeof obj.type === 'string'))
  );
}

export type TypeOpt = symbol | Function | string | TypeDef;

export interface TypeStruct {
  [key: string]: TypeOpt;
}

export interface StrictTypeStruct extends TypeStruct {
  [key: string]: TypeDef;
}

export class JSONError extends Error {}

export type JSONValue = string | number | boolean | JSONDoc | JSONDoc[];

export interface JSONDoc {
  [key: string]: JSONValue;
}

export interface JSONObject {
  types(): TypeStruct;

  toJSON(): JSONDoc;
}

export type Assignable = number | string | boolean | JSONObject;

export class InternalJSONObject {
  ___jsonprops___: StrictTypeStruct = this.___jsonprops___ || {};
}

function validateTypes(map: TypeStruct, json: JSONDoc): string[] {
  /* eslint-disable valid-typeof */
  const valid = Object.keys(map).filter(prop => {
    const mp = map[prop];
    const isFuncType = typeof mp === 'function' && mp.call(mp, json[prop as string]);
    const isStrType = typeof mp === 'string' && typeof json[prop as string] === mp;
    const isJSONObj = typeof mp === 'symbol' && mp === jsonobj;
    const isDefType: boolean =
      isTypeDef(mp) &&
      ((typeof mp.type === 'string' && typeof json[prop as string] === mp.type) ||
        (typeof mp.type === 'function' && mp.type.call(mp, json[prop as string])) ||
        mp.type === jsonobj);
    return !(
      isJSONObj ||
      isFuncType ||
      isStrType ||
      isDefType ||
      (isTypeDef(mp) && (mp.optional === true || (mp.nullable === true && json[prop as string] === null)))
    ); // check is  && prop in json
  });
  /* eslint-enable */
  return valid;
}

export type Assignee<T> = { [key in keyof T]: Assignable | Assignable[] };

export class JSONObject extends InternalJSONObject {
  types(): TypeStruct {
    throw new Error(`Unimplemented`);
  }

  toJSON(): JSONDoc {
    throw new Error(`Unimplemented`);
  }

  static fromJSON<T extends JSONObject>(this: { new (): T }, json: JSONDoc): T {
    const obj = new this() as T & JSONObject;
    if (json === null) {
      return obj as T;
    }

    const map = obj.types();
    const valid = validateTypes(map, json);

    if (valid.length === 0) {
      Object.keys(map).forEach(key => {
        const m = map[key];

        if (key in json) {
          if (isTypeDef(m)) {
            obj[key] = typeof m.parse === 'function' ? m.parse.call(m, json[key]) : json[key];
          } else {
            obj[key] = json[key];
          }
        }
      });
      return obj as T;
    }
    throw new JSONError(`Ids failed type checks: ${JSON.stringify(valid)}`);
  }

  static typedef<T extends JSONObject>(
    this: { new (): T; fromJSON(json: JSONDoc): T },
    optional: boolean = false
  ): TypeDef {
    return {
      type: jsonobj,
      parse: (val: JSONDoc) => this.fromJSON(val),
      optional
    };
  }

  static assign<T extends JSONObject>(this: { new (): T }, obj: Partial<Assignee<T>>): T {
    return Object.assign(new this(), obj);
  }
}

export type Constructor<T> = new (...args: any[]) => T;
export interface Constructable<T> {
  new (): T;
}

function defForOpt(value: TypeOpt): TypeDef {
  let def: TypeDef;
  if (typeof value === 'string' || typeof value === 'symbol') {
    def = {
      type: value
    };
  } else if (typeof value === 'function') {
    def = {
      type: value as ((val: JSONDoc) => boolean)
    };
  } else {
    def = value;
  }

  return def;
}

function defprops<T extends JSONObject>(target: T): {} {
  if (!target.___jsonprops___) target.___jsonprops___ = {}; // eslint-disable-line no-param-reassign
  return target.___jsonprops___;
}

export function JSONProperty<T extends JSONObject>(value: TypeOpt): (target: T, propertyKey: string) => void {
  return function def(target: T, propertyKey: string) {
    defprops(target)[propertyKey] = defForOpt(value);
  };
}

export function JSONObjProperty<T extends JSONObject>(value: {
  typedef<K>(): TypeDef;
}): (target: T, propertyKey: string) => void {
  return function def(target: T, propertyKey: string) {
    defprops(target)[propertyKey] = value.typedef();
  };
}

export function optional<T extends JSONObject>(target: T, propertyKey: string): void {
  defprops(target)[propertyKey].optional = true;
}

export function nullable<T extends JSONObject>(target: T, propertyKey: string): void {
  defprops(target)[propertyKey].nullable = true;
}

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-inner-declarations */
export namespace typedefs {
  export function primitiveArrayOf(
    primitiveType: 'string' | 'number' | 'boolean',
    optional: boolean = false
  ): PrimitiveArrayTypeDef {
    return new PrimitiveArrayTypeDef(primitiveType, optional);
  }

  export function arrayOf<K extends JSONObject>(
    constructor: Constructable<K> & { fromJSON(data: JSONDoc): K },
    optional: boolean = false
  ): ArrayTypeDef<K> {
    return new ArrayTypeDef<K>(constructor, optional);
  }

  export function mapOf<K extends JSONObject>(
    constructor: Constructable<K> & { fromJSON(data: JSONDoc): K },
    key: string,
    optional: boolean = false
  ): MapTypeDef<K> {
    return new MapTypeDef<K>(constructor, key, optional);
  }

  export function ofEnum<K>(enumDef: K, optional: boolean = false): EnumTypeDef<K> {
    return new EnumTypeDef<K>(enumDef, optional);
  }
}
/* eslint-enable */

export function JSONArray<K extends JSONObject, T extends JSONObject>(
  constructor: Constructable<K> & { fromJSON(data: JSONDoc): K }
): (target: T, propertyKey: string) => void {
  return function def(target: T, propertyKey: string) {
    defprops(target)[propertyKey] = typedefs.arrayOf(constructor);
  };
}

export function JSONPrimitiveArray<T extends JSONObject>(
  primitiveType: 'string' | 'number' | 'boolean'
): (target: T, propertyKey: string) => void {
  return function def(target: T, propertyKey: string) {
    defprops(target)[propertyKey] = typedefs.primitiveArrayOf(primitiveType);
  };
}

export function JSONEnum<K, T extends JSONObject>(enumDef: K): (target: T, propertyKey: string) => void {
  return function def(target: T, propertyKey: string) {
    defprops(target)[propertyKey] = typedefs.ofEnum(enumDef);
  };
}

export function JSONParsable(value: TypeStruct = {}) {
  return function def<T extends { new (...args: any[]): JSONObject }>(constructor: T) {
    return class StaticThis extends constructor implements JSONObject {
      ___jsontypes___: TypeStruct = this.___jsontypes___
        ? Object.assign(Object.assign({ ...this.___jsontypes___ }, this.___jsonprops___), value)
        : Object.assign({ ...(this.___jsonprops___ || {}) }, value);

      types(): TypeStruct {
        return this.___jsontypes___;
      }

      toJSON(): JSONDoc {
        const map = this.types();
        const x: JSONDoc = {};
        Object.keys(map).forEach(key => {
          const value = map[key];

          if (this[key] instanceof JSONObject) {
            x[key] = (this[key] as JSONObject).toJSON();
          } else if (isTypeDef(value) && value.json) {
            x[key] = value.json.call(value, this[key]);
          } else {
            x[key] = this[key];
          }
        });
        return x;
      }
    };
  };
}
