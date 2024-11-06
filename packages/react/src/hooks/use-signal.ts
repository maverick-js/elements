import { effect, type ReadSignal } from '@maverick-js/core';
import { useEffect, useState } from 'react';

export function useSignal<T>(signal: ReadSignal<T>, key?: unknown): T {
  const [, scheduleReactUpdate] = useState<{}>();

  useEffect(() => {
    return effect(() => {
      signal();
      scheduleReactUpdate({});
    });
  }, [key ?? signal]);

  return signal();
}
