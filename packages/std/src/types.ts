import type { WritableKeysOf } from 'type-fest';

export type { Constructor, Simplify } from 'type-fest';

export type PickWritable<T> = Pick<T, WritableKeysOf<T>>;

export type PickReadonly<T> = Omit<T, WritableKeysOf<T>>;

// https://github.com/vidstack/player/issues/1297
export type Optional<T> = {
  [P in keyof T]?: T[P] | undefined;
};
