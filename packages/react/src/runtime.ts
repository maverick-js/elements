import {
  $$_current_slots,
  $$_priority_attach,
  $$_set_current_host_component,
  $$_set_current_slots,
  type ComponentConstructor,
  computed,
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
import { $$_signal_name_re } from '@maverick-js/dom';
import { $$_class as $$_ssr_class, ServerStyleDeclaration } from '@maverick-js/ssr';
import { isFunction, kebabToCamelCase, unwrapDeep } from '@maverick-js/std';
import { createElement } from 'react';

import { attrsToProps } from './attrs-map';
import { useSignal } from './hooks/use-signal';

/** @internal */
export const $$_REACT_ELEMENT_TYPE = Symbol.for('react.element');

/** @internal */
export let $$_IS_CLIENT = false;

/** @internal */
export function $$_set_is_client(isClient: boolean) {
  $$_IS_CLIENT = isClient;
}

/** @internal */
export let $$_IS_SERVER = false;

/** @internal */
export function $$_set_is_server(isServer: boolean) {
  $$_IS_SERVER = isServer;
}

/** @internal */
export const $$_h = createElement;

/** @internal */
export const $$_suppress_hydration_warning = 'suppressHydrationWarning';

const noop_ref = { set: null };

/** @internal */
export function $$_ref() {
  if ($$_IS_SERVER) {
    return noop_ref;
  } else {
    return signal(null);
  }
}

/** @internal */
export function $$_on_attach(
  ref: ReadSignal<HTMLElement | null>,
  callback: (el: HTMLElement) => void,
) {
  if ($$_IS_SERVER) return;
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

/** @internal */
export function $$_expression(value: unknown) {
  if (isFunction(value)) {
    const $signal = computed(value as () => any);
    return createElement(() => useSignal($signal));
  } else {
    return value;
  }
}

/** @internal */
export function $$_append_html(template: () => Node) {
  if ($$_IS_SERVER) return null;
  return (el: Node) => {
    el.appendChild(template());
  };
}

/** @internal */
export function $$_ssr_spread(props: Record<string, any>) {
  let colonIndex = -1,
    baseClass = '',
    baseStyle = '',
    $class: Record<string, unknown> | null = null,
    $style: Record<string, unknown> | null = null,
    ssrProps: Record<string, any> = {};

  for (let name of Object.keys(props)) {
    // @ts-expect-error
    const value = unwrapDeep(props[name]);

    name = name.replace($$_signal_name_re, '');
    colonIndex = name.indexOf(':');

    if (colonIndex > 0) {
      const namespace = name.slice(0, colonIndex),
        prop = name.slice(colonIndex + 1, name.length);
      if (namespace === 'class') {
        ($class ??= {})[prop] = value;
      } else if (namespace === 'var') {
        ($style ??= {})[`--${prop}`] = value;
      } else if (namespace === 'style') {
        ($style ??= {})[prop] = value;
      }
    } else if (name === 'class') {
      baseClass = value;
    } else if (name === 'style') {
      baseStyle = value;
    } else {
      ssrProps[attrsToProps[name] ?? name] = value;
    }
  }

  if ($class) {
    ssrProps.className = $$_ssr_class(baseClass, $class);
  } else if (baseClass) {
    ssrProps.className = baseClass;
  }

  if (baseStyle || $style) {
    ssrProps.style = $$_style(baseStyle, $style);
  }

  return ssrProps;
}

/** @internal */
export function $$_style(base: string, props?: Record<string, unknown> | null) {
  const style = new ServerStyleDeclaration();

  style.parse(base, kebabToCamelCase);

  if (props) {
    for (const prop of Object.keys(props)) {
      const value = props[prop] as any;
      if (!value && value !== 0) {
        style.removeProperty(prop);
      } else {
        style.setProperty(prop, value);
      }
    }
  }

  return Object.entries(style.tokens);
}
