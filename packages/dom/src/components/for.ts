import {
  computedKeyedMap,
  computedMap,
  type ForKeyedProps,
  type ForKeyedSlots,
  type ForProps,
  type ForSlots,
  getSlots,
  staticSignal,
} from '@maverick-js/core';
import { isFunction } from '@maverick-js/std';

export function For<Item = unknown>({ each }: ForProps<Item>) {
  const slots = getSlots<ForSlots>(),
    map = slots.default;
  if (!map) {
    return null;
  } else if (isFunction(each)) {
    return computedMap(each, map);
  } else if (each) {
    return each.map((item, index) => map(staticSignal.bind(item), index));
  } else {
    return null;
  }
}

export function ForKeyed<Item = unknown>({ each }: ForKeyedProps<Item>) {
  const slots = getSlots<ForKeyedSlots>(),
    map = slots.default;
  if (!map) {
    return null;
  } else if (isFunction(each)) {
    return computedKeyedMap(each, map);
  } else if (each) {
    return each.map((item, index) => map(item, staticSignal.bind(index)));
  } else {
    return null;
  }
}
