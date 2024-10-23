import {
  $$_current_host_component,
  $$_current_slots,
  $$_priority_attach,
  $$_set_current_host_component,
  $$_set_current_slots,
  type AnyComponent,
  type ComponentConstructor,
  createComponent,
  type FunctionComponent,
  isComponentConstructor,
  RENDER_SYMBOL,
} from '@maverick-js/core';
import {
  camelToKebabCase,
  escapeHTML,
  isArray,
  isFunction,
  isNumber,
  isString,
  unwrapDeep,
} from '@maverick-js/std';

import type { HostComponentAttrs } from './components/host';
import type { ServerElement } from './element/server-element';
import { ServerStyleDeclaration } from './element/server-style-declaration';
import { ServerTokenList } from './element/server-token-list';

let $$_last_ssr = '';

/** @internal */
export function $$_ssr(template: string[], values: any[]) {
  let result = '';

  for (let i = 0; i < template.length; i++) {
    result += template[i];
    result += $$_resolve_value(values[i]);
  }

  return ($$_last_ssr = result);
}

/** @internal */
export function $$_resolve_value(value: unknown): string {
  if (isString(value) || isNumber(value)) {
    return value + '';
  } else if (isFunction(value)) {
    return $$_resolve_value(value());
  } else if (isArray(value)) {
    return $$_resolve_array(value) + '<!/[]>';
  } else {
    return '';
  }
}

/** @internal */
export function $$_resolve_array(values: unknown[]) {
  return values.flat(10).map($$_resolve_value).join('');
}

/** @internal */
export function $$_attrs(attrs: Record<string, unknown>) {
  let result = '';

  for (const name of Object.keys(attrs)) {
    const value = unwrapDeep(attrs[name]);
    if (!value && value !== '' && value !== 0) continue;
    result += ' ' + name + '=' + '"' + value + '"';
  }

  return result;
}

/** @internal */
export function $$_class(base: unknown, props: Record<string, unknown>) {
  const classList = new ServerTokenList();

  if (isString(base)) {
    classList.parse(base);
  }

  $$_class_props(classList, props);

  return classList.toString();
}

function $$_class_props(classList: ServerTokenList, props: Record<string, unknown>) {
  for (const name of Object.keys(props)) {
    const value = unwrapDeep(props[name]);
    classList[value ? 'add' : 'remove'](name);
  }
}

/** @internal */
export function $$_style(base: unknown, props: Record<string, unknown>) {
  const styles = new ServerStyleDeclaration();

  if (isString(base)) {
    styles.parse(base);
  }

  $$_style_props(styles, props);

  return styles.toString();
}

function $$_style_props(styles: ServerStyleDeclaration, props: Record<string, unknown>) {
  for (const prop of Object.keys(props)) {
    const value = unwrapDeep(props[prop]);
    if (!value && value !== 0) continue;
    styles.setProperty(prop, escapeHTML(value + ''));
  }
}

/** @internal */
export const $$_slot_stack: Array<Record<string, any> | null> = [];

/** @internal */
export const $$_host_stack: Array<AnyComponent | null> = [];

/** @internal */
export function $$_create_component(
  Component: FunctionComponent | ComponentConstructor,
  props: Record<string, any> | null = null,
  slots: Record<string, any> | null = null,
  attrs: HostComponentAttrs | null = null,
) {
  try {
    $$_slot_stack.push($$_current_slots);
    $$_set_current_slots(slots ?? {});

    if (isComponentConstructor(Component)) {
      try {
        $$_host_stack.push($$_current_host_component);

        const component = createComponent(Component, { props });
        $$_set_current_host_component(component);

        component.$$.setup();

        if (attrs) {
          $$_priority_attach(component, createAttrsCallback(attrs));
        }

        return $$_resolve_value(component[RENDER_SYMBOL]());
      } finally {
        $$_set_current_host_component($$_host_stack.pop()!);
      }
    } else {
      if ($$_current_host_component && attrs) {
        $$_priority_attach($$_current_host_component, createAttrsCallback(attrs));
      }

      return $$_resolve_value(Component(props ?? {}));
    }
  } finally {
    $$_set_current_slots($$_slot_stack.pop()!);
  }
}

function createAttrsCallback(attrs: HostComponentAttrs) {
  return (host: HTMLElement) => {
    const $$host = host as unknown as ServerElement;

    if (attrs.class) {
      $$host.classList.parse(attrs.class);
    }

    if (attrs.$class) {
      $$_class_props($$host.classList, attrs.$class);
    }

    if (attrs.$var) {
      $$_style_props($$host.style, attrs.$var);
    }
  };
}

/** @internal */
export function $$_merge_props(...sources: Record<string, unknown>[]) {
  const target = sources[0] || {};

  for (let i = 1; i < sources.length; i++) {
    const source = sources[i];
    if (source) Object.assign(target, source);
  }

  return target;
}

/** @internal */
export const $$_signal_name_re = /* #__PURE__ */ /^\$/;

/** @internal */
export function $$_merge_attrs(...sources: Record<string, unknown>[]) {
  let {
      class: _class,
      $class: _$class,
      style: _style,
      $style: _$style,
      ...props
    } = $$_merge_props(...sources),
    $class: Record<string, unknown> | null = null,
    $style: Record<string, unknown> | null = null,
    attrs: Record<string, unknown> = {},
    baseClass = unwrapDeep(_class ?? _$class),
    baseStyle = unwrapDeep(_style ?? _$style),
    colonIndex = -1;

  for (let name of Object.keys(props)) {
    const value = props[name];

    name = name.replace($$_signal_name_re, '');
    colonIndex = name.indexOf(':');

    if (colonIndex > 0) {
      const namespace = name.slice(0, colonIndex),
        prop = name.slice(colonIndex + 1, name.length);
      if (namespace === 'class') {
        ($class ??= {})[prop] = value;
      } else if (namespace === 'style') {
        ($style ??= {})[camelToKebabCase(prop)] = value;
      } else if (namespace === 'var') {
        ($style ??= {})[`--${prop}`] = value;
      }
    } else {
      attrs[name] = value;
    }
  }

  attrs.class = $class ? $$_class(baseClass, $class) : baseClass;
  attrs.style = $style ? $$_style(baseStyle, $style) : baseStyle;

  return $$_attrs(attrs);
}

/** @internal */
export function $$_merge_host_attrs(...sources: Record<string, unknown>[]) {
  let { class: _class, ...props } = $$_merge_props(...sources),
    attrs: {
      class?: unknown;
      $class: Record<string, unknown> | null;
      $var: Record<string, unknown> | null;
    } = { class: _class, $class: null, $var: null },
    colonIndex = -1;

  // Filter out component props so they're not rendered as element attributes.
  for (let name of Object.keys(props)) {
    const value = props[name];

    name = name.replace($$_signal_name_re, '');
    colonIndex = name.indexOf(':');

    if (colonIndex === -1) continue;

    const namespace = name.slice(0, colonIndex),
      prop = name.slice(colonIndex + 1, name.length);

    if (namespace === 'class') {
      (attrs.$class ??= {})[prop] = value;
    } else if (namespace === 'var') {
      (attrs.$var ??= {})[`--${prop}`] = value;
    }
  }

  return attrs;
}

/** @internal */
export function $$_escape(value: any, isAttr = false) {
  if (!isAttr && isString(value) && value === $$_last_ssr) return value;
  return escapeHTML(value, isAttr);
}

/** @internal */
export const $$_unwrap = unwrapDeep;
