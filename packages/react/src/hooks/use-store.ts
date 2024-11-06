import type { AnyRecord, ReadSignalRecord, StoreFactory } from '@maverick-js/core';

import { useReactContext } from '../scope';

export function useStore<Record extends AnyRecord>(
  store: StoreFactory<Record>,
): ReadSignalRecord<Record> {
  return useReactContext(store) as ReadSignalRecord<Record>;
}
