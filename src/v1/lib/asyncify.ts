const asyncify = handler =>
  function asyncUtilWrap(...args) {
    const val = handler(...args);
    const next = args[args.length - 1];
    return Promise.resolve(val).catch(next);
  };

export default asyncify;
