import {
  $$_current_slots,
  $$_priority_attach,
  $$_set_current_host_component,
  $$_set_current_slots,
  type ComponentConstructor,
  createComponent,
  effect,
  type FunctionComponent,
  isComponentConstructor,
  peek,
  type ReadSignal,
  RENDER_SYMBOL,
  type Scope,
  signal,
  type Slot,
  type SlotRecord,
} from '@maverick-js/core';
import { createElement } from 'react';

export const $$_IS_CLIENT = typeof document !== 'undefined';

export const $$_IS_SERVER = !$$_IS_CLIENT;

/** @internal */
export const $$_signal = signal;

/** @internal */
export const $$_h = createElement;

/** @internal */
export function $$_on_attach(
  ref: ReadSignal<HTMLElement | null>,
  callback: (el: HTMLElement) => void,
) {
  effect(() => {
    let el = ref();
    if (el) callback(el);
  });
}

/** @internal */
export let $$_component_scope: Scope | null = null;

/** @internal */
export const $$_slot_stack: Array<SlotRecord | null> = [];

/** @internal */
export const $$_component_scope_stack: Array<Scope | null> = [];

/** @internal */
export function $$_create_component(
  Component: FunctionComponent | ComponentConstructor,
  props: Record<string, unknown> | null = null,
  listen: ((target: EventTarget) => void) | null = null,
  slots: Record<string, Slot> | null = null,
  onAttach: ((host: HTMLElement) => void) | null = null,
) {
  return peek(() => {
    try {
      $$_slot_stack.push($$_current_slots);
      $$_component_scope_stack.push($$_component_scope);

      $$_set_current_slots(slots ?? {});

      if (isComponentConstructor(Component)) {
        const component = createComponent(Component, { props });

        $$_component_scope = component.scope;
        $$_set_current_host_component(component);

        listen?.(component);
        if (onAttach) $$_priority_attach(component, onAttach);

        component.$$.setup();

        // TODO: What if render returns function? return $$_expression? (update below as well)
        return component[RENDER_SYMBOL]();
      } else {
        return Component(props ?? {});
      }
    } finally {
      $$_component_scope = $$_component_scope_stack.pop()!;
      $$_set_current_slots($$_slot_stack.pop()!);
    }
  });
}

/** @internal */
export function $$_set_html(__html: string) {
  return { dangerouslySetInnerHTML: { __html } };
}

// expression(compute: ts.Expression, deps?: ts.Expression[]) {
//   return this.#createCompute('expression', compute, deps);
// }

/** @internal */
export function $$_append_html(template: () => Node) {
  return (el: Node) => {
    el.appendChild(template());
  };
}

// ~= merge_attrs (filter out namespaces and map to react props)
// $$_spread(props: ts.Expression) {
// }

// $$_style(base: ts.Expression, props?: ts.PropertyAssignment[]) {
// }
