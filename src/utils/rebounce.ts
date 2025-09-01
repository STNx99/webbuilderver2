/**
 * Non-hook debouncing utility for use outside React (e.g. in stores or plain TS modules).
 *
 * createRebounce returns an object with:
 *  - trigger(...args): schedules the provided callback with the last supplied args
 *  - cancel(): cancels any pending scheduled invocation
 *  - flush(): immediately invokes the pending callback (if any) and clears the timer
 *
 * Characteristics:
 *  - The returned functions are plain functions (not tied to React lifecycle).
 *  - It keeps the last provided args and only calls the callback with the most recent ones.
 *  - The callback may be synchronous or asynchronous; flush returns whatever the callback returns.
 *
 * Example:
 *  const r = createRebounce((payload) => api.save(payload), 250);
 *  r.trigger({ width: 100 });
 *  r.trigger({ width: 120 }); // previous pending call is replaced
 *  // after 250ms, api.save({ width: 120 }) runs
 *
 * Type parameters:
 *  F - function signature to debounce. Parameters and return types are inferred.
 */

type AnyFn = (...args: any[]) => any;

export function createRebounce<F extends AnyFn>(callback: F, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  const flush = (): ReturnType<F> | undefined => {
    if (timer !== null && lastArgs !== null) {
      // capture args and cancel pending timer
      const args = lastArgs;
      cancel();
      try {
        // call callback with the last args
        return callback(...(args as Parameters<F>));
      } catch (err) {
        // Surface to console for diagnosis but don't rethrow here
        // so callers can choose to handle errors if they wish.
        // eslint-disable-next-line no-console
        console.error("createRebounce flush callback error:", err);
        return undefined;
      }
    }
    return undefined;
  };

  const trigger = (...args: Parameters<F>): void => {
    lastArgs = args;

    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      timer = null;
      const currentArgs = lastArgs || ([] as unknown as Parameters<F>);
      lastArgs = null;
      try {
        // invoke the callback with the latest args
        // we intentionally ignore the return value here
        // because trigger is fire-and-forget; use flush to synchronously get result.
        callback(...(currentArgs as Parameters<F>));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("createRebounce callback error:", err);
      }
    }, delay);
  };

  return { trigger, cancel, flush } as {
    trigger: (...args: Parameters<F>) => void;
    cancel: () => void;
    flush: () => ReturnType<F> | undefined;
  };
}
