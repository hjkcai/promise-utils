/**
 * Rather than just blanket propagating errors, allows you to specify an error handler that can
 * transform it to something useful or throw a wrapped error.
 *
 * @param {Function} fn - An async function to wrap
 * @param {Function} errorHandler
 *     - a function that will process any errors produced by the original function
 * @returns A wrapped version of function that uses error handler
 */
export function transformErrors<T extends Function>(fn: T, errorHandler: Function): T {
  // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  return (((...args: any[]): Promise<any> => {
    // tslint:disable-next-line:no-any
    return new Promise(resolve => resolve(fn(...args))).catch(errorHandler as any);
    // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  }) as any) as T;
}
