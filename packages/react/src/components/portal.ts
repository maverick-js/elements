import { computed, getSlots, type PortalProps, type PortalTarget } from '@maverick-js/core';
import { isFunction, isString } from '@maverick-js/std';
import { createElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { useSignal } from '../hooks/use-signal';
import { $$_IS_SERVER } from '../runtime';

export function Portal({ to }: PortalProps) {
  const slots = getSlots(),
    children = slots.default?.() as ReactNode;

  if ($$_IS_SERVER) {
    return null;
  } else if (isFunction(to)) {
    const $target = computed(() => getContainer(to()));
    return createElement(() => {
      const container = useSignal($target);
      return portal(container, children);
    });
  } else {
    return portal(getContainer(to), children);
  }
}

function portal(container: Element | null, children: ReactNode) {
  return container ? createPortal(children, container) : null;
}

function getContainer(target: PortalTarget) {
  return isString(target) ? document.querySelector(target) : target;
}
