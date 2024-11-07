import {
  $$_current_host_component,
  type AnyComponent,
  type ComponentConstructor,
  getSlots,
  type HostProps,
} from '@maverick-js/core';
import { $$_attr, $$_signal_name_re } from '@maverick-js/dom';
import { ServerElement } from '@maverick-js/ssr';
import { isString, kebabToCamelCase, setAttribute, unwrapDeep } from '@maverick-js/std';
import { createElement, type ReactNode } from 'react';

import { attrsToProps } from '../attrs-map';
import { $$_IS_SERVER, $$_on_attach, $$_ref, $$_suppress_hydration_warning } from '../runtime';

export function Host(attrs: HostProps) {
  const ctor = $$_current_host_component?.constructor as ComponentConstructor | undefined;

  if (__DEV__ && !$$_current_host_component) {
    throw Error(
      `[maverick]: <Host> can only be called at the top of a class component render function [@${ctor?.name}]`,
    );
  }

  if (__DEV__ && !ctor?.element) {
    throw Error(
      `[maverick]: \`static element: CustomElementOptions\` must be provided on class component when using <Host> [@${ctor?.name}]`,
    );
  }

  if (!ctor) return null;

  const tagName = ctor.element!.fallbackTag,
    ref = $$_ref(),
    props: Record<string, any> = {
      [$$_suppress_hydration_warning]: true,
      ref: ref.set,
    },
    slots = getSlots(),
    children = slots.default?.() as ReactNode;

  if ($$_IS_SERVER) {
    const host = new ServerElement(tagName, $$_current_host_component!);

    const style = attrs.style ?? attrs.$style;
    if (style) {
      const value = unwrapDeep(style);
      if (isString(value)) host.style.parse(value, kebabToCamelCase);
      delete attrs.style;
      delete attrs.$style;
    }

    for (const prop of Object.keys(attrs)) {
      const name = prop.replace($$_signal_name_re, ''),
        value = unwrapDeep(attrs[name]);
      setAttribute(host as unknown as HTMLElement, name, value);
    }

    $$_current_host_component!.$$.attach(host as unknown as HTMLElement);

    if (host.classList.length > 0) {
      props.className = host.classList.toString();
    }

    if (host.style.length > 0) {
      props.style = Object.fromEntries(host.style.tokens);
    }

    for (const [name, value] of host.attributes.tokens.entries()) {
      const propName = attrsToProps[name] ?? name;
      props[propName] = value;
    }
  } else {
    const component = $$_current_host_component!;
    $$_on_attach(ref, (el) => {
      for (const prop of Object.keys(attrs)) {
        const name = prop.replace($$_signal_name_re, '');
        $$_attr(el, name, attrs[name]);
      }

      component.$$.attach(el);
      const connectId = requestAnimationFrame(connect.bind(component));

      return () => {
        cancelAnimationFrame(connectId);
        component.$$.disconnect();
        component.$$.detach();
      };
    });
  }

  return createElement(tagName, props, children);
}

function connect(this: AnyComponent) {
  this.$$.connect();
}
