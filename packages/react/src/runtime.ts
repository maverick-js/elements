import {
  type ComponentConstructor,
  type FunctionComponent,
  getScope,
  root,
  type Scope,
  scoped,
} from '@maverick-js/core';
import { createElement, useEffect, useMemo, useRef } from 'react';
import type * as React from 'react';

export const $$_IS_CLIENT = typeof document !== 'undefined';

export const $$_IS_SERVER = !$$_IS_CLIENT;

/** @internal */
export const $$_h = createElement;

/** @internal */
export function $$_get_scope() {
  return getScope()!;
}

/** @internal */
export function $$_attach_callback(scope: Scope | null, callback: (el: Element) => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    return scoped(() => {
      return root((dispose) => {
        callback(ref.current!);
        return dispose;
      });
    }, scope);
  }, []);

  return ref;
}

/** @internal */
export let $$_component_scope: Scope | null = null;

/** @internal */
export const $$_component_scope_stack: Array<Scope | null> = [];

/** @internal */
export function $$_create_component(
  Component: FunctionComponent | ComponentConstructor,
  props: Record<string, unknown> | null = null,
  listen: ((target: EventTarget) => void) | null = null,
  slots: Record<string, () => React.ReactNode> | null = null,
  onAttach: ((host: HTMLElement) => void) | null = null,
) {
  try {
    $$_component_scope_stack.push($$_component_scope);

    // before set scope
    // render
  } finally {
    $$_component_scope = $$_component_scope_stack.pop()!;
  }

  // setup code here
  // slots need to be scoped!
  // return render function result
}

/** @internal */
export function $$_set_html(__html: string) {
  return { dangerouslySetInnerHTML: { __html } };
}

/** @internal */
export function $$_memo<T>(scope: Scope | null, factory: () => T, deps: unknown[] = []) {
  return useMemo(() => scoped(factory, scope), deps);
}

// scoped
// computed(compute: ts.Expression | ts.Block, deps?: ts.Expression[]) {
//   return this.#createCompute('computed', compute, deps);
// }

// scoped
// expression(compute: ts.Expression, deps?: ts.Expression[]) {
//   return this.#createCompute('expression', compute, deps);
// }

// appendHtml(html: ts.Expression) {
//   return this.call('append_html', [html]);
// }

// ~= merge_attrs (filter out namespaces and map to react props)
// $$_merge_attrs(props: ts.Expression) {
// }

// peek
// $$_style(base: ts.Expression, props?: ts.PropertyAssignment[]) {
// }
