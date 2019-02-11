export interface DatabaseQuery<Q, K> {
  timestamp: number;
  result: K;
  params: Q;
}
export interface DatabaseQueryNoParams<K> {
  timestamp: number;
  result: K;
}

export type DBQuery<Q, K> = DatabaseQuery<Q, K> | DatabaseQueryNoParams<K>;

export class DB {
  protected datastore;

  protected constructor(datastore) {
    this.datastore = datastore;
  }

  protected static queryHasParams<Q, K>(
    query: DBQuery<Q, K>
  ): query is DatabaseQuery<Q, K> {
    return "params" in query;
  }

  protected static query<Q, K>(
    result: K,
    params?: Q | undefined
  ): DBQuery<Q, K> {
    return {
      timestamp: Date.now(),
      result,
      params // TODO
    };
  }
}
