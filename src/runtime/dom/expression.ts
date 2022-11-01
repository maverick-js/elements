import type { JSX } from '../jsx';
import { effect, isObserved } from '../reactivity';
import { createComment, createFragment, insert, isDOMNode } from './utils';
import { isArray, isFunction, isNumber, isString } from '../../utils/unit';
import { hydration } from './render';
import { run } from '../../utils/fn';

const TEXT = Symbol();
const END_MARKER = Symbol();

// <!--$-->
export type StartMarker = Comment & {
  [TEXT]?: Text | null;
  /** Matching end marker. */
  [END_MARKER]?: EndMarker;
};

// <!--/$-->
export type EndMarker = Comment;

export function insertExpression(start: StartMarker, value: JSX.Element, isObservable = false) {
  if (isFunction(value)) {
    let observed = false;

    const stop = effect(() => {
      insertExpression(start, (value as Function)(), true);
      observed = isObserved();
    });

    if (!observed) {
      const idle = __TEST__ ? run : requestIdleCallback ?? requestAnimationFrame;
      idle(() => {
        stop();
        start.remove();
        start[END_MARKER]?.remove();
      });
    }

    return;
  } else if (hydration && !isObservable) {
    start.remove();
    return;
  }

  let lastChild: Node = start,
    end = start[END_MARKER];

  if (isArray(value)) {
    // This won't exist yet when hydrating so nodes will stay intact.
    if (end) removeNodesBetweenMarkers(start, end);

    const flattened = value.flat(10);

    if (hydration) {
      lastChild = getLastNode(start, flattened.length);
    } else {
      const fragment = createFragment();
      for (let i = 0; i < flattened.length; i++) {
        const child = flattened[i];
        if (isFunction(child) || isArray(child)) {
          insert(fragment, child);
        } else if (child) {
          fragment.append(child as string);
        }
      }
      lastChild = fragment.lastChild || lastChild;
      start.after(fragment);
    }
  } else if (isDOMNode(value)) {
    // This won't exist yet when hydrating so nodes will stay intact.
    if (end) removeNodesBetweenMarkers(start, end);

    // Fragment
    if (value.nodeType === 11) {
      lastChild = !hydration
        ? value.lastChild || lastChild
        : getLastNode(start, value.childNodes.length);
    } else {
      lastChild = !hydration ? value : start.nextSibling!;
    }

    if (!hydration) start.after(value);
  } else if (isString(value) || isNumber(value)) {
    if (start[TEXT]) {
      start[TEXT].data = value + '';
    } else {
      if (!hydration) {
        lastChild = document.createTextNode(value + '');
        start.after(lastChild);
      } else {
        lastChild = start.nextSibling!;
      }
      start[TEXT] = lastChild as Text;
    }
  } else if (end) {
    removeNodesBetweenMarkers(start, end);
  }

  if (!isObservable) {
    start.remove();
    return;
  }

  if (!end) {
    const marker = createComment('/$');
    start[END_MARKER] = marker;
    (lastChild as Element).after(marker);
  }
}

function getNodeIndex(node: Node) {
  // @ts-expect-error
  return [].indexOf.call(node.parentNode!.childNodes, node);
}

function removeNodesBetweenMarkers(start: Node, end: Node) {
  let next = start.nextSibling,
    sibling;

  while (next && next !== end) {
    sibling = next.nextSibling;
    next.remove();
    next = sibling;
  }

  start[TEXT] = null;
}

function getLastNode(start: StartMarker, nodesCount: number) {
  return start.parentElement!.childNodes[getNodeIndex(start) + nodesCount];
}

export type MarkerWalker = TreeWalker;

export const createMarkerWalker = (root: Node): MarkerWalker =>
  // @ts-expect-error - filter accepts `boolean` but not typed.
  document.createTreeWalker(root, NodeFilter.SHOW_COMMENT, (node) => node.nodeValue === '$');