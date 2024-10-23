import {
  type ForKeyedProps,
  type ForKeyedSlots,
  type ForProps,
  type ForSlots,
  getSlots,
} from '@maverick-js/core';
import { unwrapDeep } from '@maverick-js/std';

export function For<Item = unknown>({ each }: ForProps<Item>) {
  const slots = getSlots<ForSlots>(),
    result: string[] = [];

  if (each && slots.default) {
    const list = unwrapDeep(each);
    for (let i = 0; i < list.length; i++) {
      result.push(slots.default!(() => list[i], i) as string);
    }
  }

  return result;
}

export function ForKeyed<Item = unknown>({ each }: ForKeyedProps<Item>) {
  const slots = getSlots<ForKeyedSlots>(),
    result: string[] = [];

  if (each && slots.default) {
    const list = unwrapDeep(each);
    for (let i = 0; i < list.length; i++) {
      result.push(slots.default!(list[i], () => i) as string);
    }
  }

  return result;
}
