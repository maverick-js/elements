import {
  computed,
  effect,
  getSlots,
  type JSX,
  onDispose,
  type PortalProps,
  type PortalTarget,
} from '@maverick-js/core';
import { isFunction, isString } from '@maverick-js/std';

import { insert } from '../insert';

export function Portal({ to }: PortalProps) {
  const slots = getSlots(),
    children = slots.default?.();

  if (isFunction(to)) {
    const $container = computed(() => getContainer(to()));
    effect(() => portal($container(), children));
  } else {
    portal(getContainer(to), children);
  }
}

function portal(target: Element | null, children: JSX.Element) {
  if (!target) return;

  const root = document.createElement('div');
  root.style.display = 'contents';
  root.setAttribute('data-portal', '');
  insert(root, children, null);

  target.appendChild(root);
  onDispose(() => void target.removeChild(root));
}

function getContainer(target: PortalTarget) {
  return isString(target) ? document.querySelector(target) : target;
}
