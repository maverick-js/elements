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
import { isFunction, unwrapDeep } from '@maverick-js/std';
import { createElement, type ReactNode } from 'react';

import { useSignal } from '../hooks/use-signal';
import { $$_is_react_element, $$_IS_SERVER } from '../runtime';

export function For<Item = unknown>({ each }: ForProps<Item>) {
  if ($$_IS_SERVER) {
    const slots = getSlots<ForSlots>(),
      map = slots.default ? (item, index) => slots.default!(() => item, index) : null;

    return ssr({ each, map });
  } else {
    const slots = getSlots<ForSlots>(),
      map = slots.default;

    if (!map) {
      return null;
    } else if (isFunction(each)) {
      const $list = computedMap(each, map);
      return createElement(() => useSignal($list) as ReactNode[]);
    } else if (each) {
      return each.map((item, index) => map(staticSignal.bind(item), index));
    } else {
      return null;
    }
  }
}

export function ForKeyed<Item = unknown>({ each, key }: ForKeyedProps<Item>) {
  if ($$_IS_SERVER) {
    const slots = getSlots<ForKeyedSlots>(),
      map = slots.default ? (item, index) => slots.default!(item, () => index) : null;

    return ssr({ each, map, key });
  } else {
    const slots = getSlots<ForKeyedSlots>(),
      map = slots.default;

    if (!map) {
      return null;
    } else if (isFunction(each)) {
      const $list = computedKeyedMap(each, (item, index) => {
        const node = map(item, index) as any;
        return $$_is_react_element(node) ? { ...node, key: key(item) } : node;
      });

      return createElement(() => useSignal($list));
    } else if (each) {
      return each.map((item, index) => map(item, staticSignal.bind(index)));
    } else {
      return null;
    }
  }
}

function ssr<Item>({
  each,
  key,
  map,
}: Partial<Omit<ForKeyedProps<Item>, 'children'>> & {
  map: ((item: Item, index: number) => any) | null;
}) {
  if (!map) return null;

  const list = unwrapDeep(each);
  if (!list) return null;

  const result: ReactNode[] = [];

  for (let i = 0; i < list.length; i++) {
    let item = list[i],
      node = map(item, i);

    if (key && $$_is_react_element(node)) {
      node = { ...node, key: key(item) };
    }

    result.push(node);
  }

  return createElement(() => result);
}