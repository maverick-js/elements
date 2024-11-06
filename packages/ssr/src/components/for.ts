import {
  type ForKeyedProps,
  type ForKeyedSlots,
  type ForProps,
  type ForSlots,
  getSlots,
  staticSignal,
} from '@maverick-js/core';
import { unwrapDeep } from '@maverick-js/std';

export function For<Item = unknown>({ each }: ForProps<Item>) {
  const slots = getSlots<ForSlots>(),
    map = slots.default;

  if (!map || !each) return null;

  const result: string[] = [],
    list = unwrapDeep(each);

  for (let i = 0; i < list.length; i++) {
    result.push(map(staticSignal.bind(list[i]), i) as string);
  }

  return result;
}

export function ForKeyed<Item = unknown>({ each }: ForKeyedProps<Item>) {
  const slots = getSlots<ForKeyedSlots>(),
    map = slots.default;

  if (!map || !each) return null;

  const result: string[] = [],
    list = unwrapDeep(each);

  for (let i = 0; i < list.length; i++) {
    result.push(map(list[i], staticSignal.bind(i)) as string);
  }

  return result;
}
