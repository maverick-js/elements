import type { PickReadonly, PickWritable } from '@maverick-js/std';

import { useContext } from './context';
import { computed, type ReadSignal, signal, type WriteSignal } from './signals';
import type { AnyRecord, ReadSignalRecord } from './types';

export class StoreFactory<Record> {
  readonly id = Symbol('maverick.store');
  readonly record: Record;

  #descriptors: {
    [P in keyof Record]: TypedPropertyDescriptor<Record[P]>;
  };

  constructor(record: Record) {
    this.record = record;
    this.#descriptors = Object.getOwnPropertyDescriptors(record);
  }

  create(): Store<Record> {
    const store = {} as Store<Record>,
      state = new Proxy(store, { get: (_, prop: any) => store[prop]() });

    for (const name of Object.keys(this.record as AnyRecord) as any[]) {
      const getter = this.#descriptors[name].get;
      store[name] = getter ? computed(getter.bind(state)) : signal(this.record[name]);
    }

    return store;
  }

  reset(store: Store<Record>, filter?: (key: keyof Record) => boolean): void {
    for (const name of Object.keys(store) as any[]) {
      if (!this.#descriptors[name].get && (!filter || filter(name))) {
        (store[name] as WriteSignal<any>).set(this.record[name]);
      }
    }
  }
}

export type Store<T> = {
  readonly [P in keyof PickReadonly<T>]: ReadSignal<T[P]>;
} & {
  readonly [P in keyof PickWritable<T>]: WriteSignal<T[P]>;
};

export type InferStore<T> =
  T extends StoreFactory<infer Record> ? Store<Record> : T extends Store<any> ? T : never;

export type InferStoreRecord<T> =
  T extends StoreFactory<infer Record> ? Record : T extends Store<infer Record> ? Record : never;

export type StoreContext<T> = ReadSignalRecord<T extends StoreFactory<infer Record> ? Record : T>;

/**
 * Converts objects into signals. The factory stores the initial object and enables producing new
 * objects where each value in the provided object becomes a signal.
 *
 * @example
 * ```ts
 * const store = createStore({
 *   foo: 0,
 *   bar: '...',
 *   get baz() {
 *     return this.foo + 1;
 *   }
 * });
 *
 * console.log(store.record); // logs `{ foo: 0, bar: '...' }`
 *
 * const $state = store.create();
 *
 * effect(() => console.log($state.foo()));
 * // Run effect ^
 * $state.foo.set(1);
 *
 * // Reset all values
 * store.reset($state);
 * ```
 */
export function createStore<Record extends AnyRecord>(record: Record) {
  return new StoreFactory<Record>(record);
}

/**
 * Returns the store context for the current component tree.
 */
export function useStore<Record extends AnyRecord>(
  store: StoreFactory<Record>,
): StoreContext<Record> {
  return useContext(store);
}
