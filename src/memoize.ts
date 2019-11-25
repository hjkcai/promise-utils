/**
 * Caches the results of an async function. When creating a hash to store function results against,
 * the callback is omitted from the hash and an optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key, which may work
 * reasonably if it is a string or a data type that converts to a distinct string. Note that objects
 * and arrays will not behave reasonably. Neither will cases where the other arguments are
 * significant. In such cases, specify your own hash function.
 *
 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash for storing
 *     results. It has all the arguments applied to it and must be synchronous.
 * @returns a memoized version of fn
 */
export function memoize<FnType extends Function>(
  fn: FnType,
  // tslint:disable-next-line:no-any (w/o type for Function args, can't assert a type here)
  hasher: Function = (arg: any) => arg,
  timeoutMs?: number,
): FnType & { reset: FnType; clear: () => void } {
  // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
  // what you can do with it)
  let memos: Record<any, { value: any; expiration: number } | undefined> = {};
  const queues: Record<any, Promise<any> | undefined> = {};

  const returnFn = (((...args: any[]): Promise<any> => {
    const key: any = hasher(...args);
    if (memos[key]) {
      if (!timeoutMs || Date.now() < memos[key]!.expiration) {
        return memos[key]!.value;
      }
    }

    if (queues[key]) {
      return queues[key]!;
    }

    const promise: Promise<any> = new Promise(resolve => resolve(fn(...args)));
    queues[key] = promise;

    return queues[key]!.then(ret => {
      memos[key] = { value: ret, expiration: Date.now() + (timeoutMs || 0) };
      queues[key] = undefined;
      return ret;
    }).catch(err => {
      queues[key] = undefined;
      throw err;
    });
  }) as any) as FnType;

  const reset = (...args: any[]): void => {
    const key = hasher(...args);
    memos[key] = undefined;
  };

  const clear = (): void => {
    memos = {};
  };

  (returnFn as any).reset = reset;
  (returnFn as any).clear = clear;

  return returnFn as FnType & { reset: FnType; clear: () => void };
  // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
  // you can do with it)
}
