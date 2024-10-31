import { effect, type ReadSignal } from '@maverick-js/core';
import * as React from 'react';

export function useSignal<T>(signal: ReadSignal<T>, key?: unknown): T {
  const [, scheduleReactUpdate] = React.useState<{}>();

  React.useEffect(() => {
    return effect(() => {
      signal();
      scheduleReactUpdate({});
    });
  }, [key ?? signal]);

  return signal();
}
