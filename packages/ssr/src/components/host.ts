import {
  $$_current_host_component,
  type ComponentConstructor,
  DEFINE_ELEMENT_SYMBOL,
  getSlots,
  type HostProps,
  type JSX,
} from '@maverick-js/core';
import { isString, setAttribute, unwrapDeep } from '@maverick-js/std';

import { ServerElement } from '../element/server-element';
import { $$_signal_name_re } from '../runtime';

export interface HostComponentAttrs {
  class?: string;
  $class?: Record<string, JSX.ClassValue>;
  $var?: Record<string, JSX.CSSValue>;
}

export function Host({ style, $style, ...props }: HostProps) {
  const ctor = $$_current_host_component?.constructor as ComponentConstructor | undefined;

  if (!$$_current_host_component) {
    throw Error(
      `[maverick]: <Host> can only be called at the top of a class component render function [@${ctor?.name}]`,
    );
  }

  if (!ctor?.element) {
    throw Error(
      `[maverick]: \`static element: CustomElementOptions\` must be provided on class component when using <Host> [@${ctor?.name}]`,
    );
  }

  const isCustomElement = DEFINE_ELEMENT_SYMBOL in ctor,
    tagName = isCustomElement ? ctor.element.name : ctor.element.fallbackTag,
    $$host = new ServerElement(tagName, $$_current_host_component),
    slots = getSlots();

  if (style || $style) {
    const value = style ?? unwrapDeep($style);
    if (isString(value)) $$host.style.parse(value);
  }

  for (const name of Object.keys(props)) {
    const value = unwrapDeep(props[name]);
    setAttribute($$host as unknown as HTMLElement, name.replace($$_signal_name_re, ''), value);
  }

  $$host.setAttribute('data-maverick', '');

  $$_current_host_component.$$.attach($$host as unknown as HTMLElement);

  let attrs = $$host.attributes.toString();

  if ($$host.classList.length > 0) {
    attrs += ` class="${$$host.classList.toString()}"`;
  }

  if ($$host.style.length > 0) {
    attrs += ` style="${$$host.style.toString()}"`;
  }

  return `<!$><${tagName}${attrs}>${slots.default?.() ?? ''}</${tagName}>`;
}
