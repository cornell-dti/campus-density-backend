export type DatabaseQuery<Q, K> = { timestamp: number; result: K; params: Q };
export type DatabaseQueryNoParams<K> = { timestamp: number; result: K };
export type DBQuery<Q, K> = DatabaseQuery<Q, K> | DatabaseQueryNoParams<K>;

export class db {
  datastore;

  constructor(datastore) {
    this.datastore = datastore;
  }

  static query_has_params<Q, K>(
    query: DBQuery<Q, K>
  ): query is DatabaseQuery<Q, K> {
    return "params" in query;
  }

  static query<Q, K>(result: K, params?: Q | undefined): DBQuery<Q, K> {
    return {
      timestamp: Date.now(),
      result,
      params // TODO
    };
  }
}
