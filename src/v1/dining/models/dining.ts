import { JSONParsable, JSONObject, JSONArray } from '../../lib/json';

@JSONParsable({ category: 'string' })
export class Meals extends JSONObject {
  category: string;
  items: string[];
}

@JSONParsable({ description: 'string', startTime: 'number', endTime: 'number' })
export class MealMenu extends JSONObject {
  description: string;
  startTime: number;
  endTime: number;
  @JSONArray(Meals)
  menu: Meals[];
}

@JSONParsable({ date: 'string' })
export class DayMenu extends JSONObject {
  date: string;
  @JSONArray(MealMenu)
  menus: MealMenu[];
}

@JSONParsable({ id: 'string' })
export class DiningDocument extends JSONObject {
  id: string;
  @JSONArray(DayMenu)
  weeksMenus: DayMenu[];
}
