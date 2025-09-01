import { useCallback, useEffect, useRef } from "react";

/**
 * A small, flexible debouncing hook for React.
 *
 * useRebounce returns an object with:
 *  - trigger(...args): schedules the provided callback with the last supplied args
 *  - cancel(): cancels any pending scheduled invocation
 *  - flush(): immediately invokes the pending callback (if any) and clears the timer
 *
 * Characteristics:
 *  - The hook keeps a stable `trigger` function identity (safe to pass to children).
 *  - The provided callback reference is tracked via ref so callers don't need to
 *    re-create the hook when `callback` identity changes.
 *  - The delay is tracked via ref so it can be changed without re-creating the
 *    trigger function.
 *
 * Usage:
 *  const { trigger, cancel, flush } = useRebounce(myCallback, 250);
 *  trigger(arg1, arg2); // will call myCallback(arg1, arg2) after 250ms of inactivity
 *
 * Type parameters:
 *  F - the function signature to debounce. Parameters and return types are inferred.
 */
export default function useRebounce<F extends (...args: any[]) => any>(
  callback: F,
  delay = 300,
) {
  // Mutable refs to keep latest values without forcing hook recreation
  const callbackRef = useRef<F>(callback);
  const delayRef = useRef<number>(delay);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<any[] | null>(null);

  // Keep refs up-to-date when inputs change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  // Cancel any pending timer
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastArgsRef.current = null;
  }, []);

  // Immediately invoke pending call (if any) and clear timer
  const flush = useCallback(() => {
    if (timerRef.current && lastArgsRef.current) {
      // capture values
      const args = lastArgsRef.current;
      cancel();
      // call outside of timer
      try {
        callbackRef.current(...args);
      } catch (err) {
        // Swallow or rethrow depending on your app's error strategy.
        // For now, log to console for visibility.
        // eslint-disable-next-line no-console
        console.error("useRebounce flush callback error:", err);
      }
    }
  }, [cancel]);

  // Stable trigger function used to schedule debounced invocation
  const trigger = useCallback((...args: Parameters<F>): void => {
    lastArgsRef.current = args;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const currentArgs = lastArgsRef.current || [];
      lastArgsRef.current = null;
      try {
        callbackRef.current(...(currentArgs as Parameters<F>));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("useRebounce callback error:", err);
      }
    }, delayRef.current);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastArgsRef.current = null;
    };
  }, []);

  return { trigger, cancel, flush };
}
