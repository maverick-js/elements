import { getScope, root, Scope, scoped, signal, tick } from '@maverick-js/signals';
import type { Writable } from 'type-fest';

import { createAccessors, provideContextMap, useContextMap, WriteSignals } from '../runtime';
import {
  ATTACH,
  CONNECT,
  DESTROY,
  LIFECYCLES,
  MEMBERS,
  MOUNT,
  PROPS,
  RENDER,
  SCOPE,
  setCustomElementInstance,
} from './internal';
import type {
  AnyCustomElement,
  CustomElementDefinition,
  CustomElementHost,
  CustomElementInstance,
  CustomElementInstanceInit,
  CustomElementPropDefinitions,
  InferCustomElementProps,
} from './types';

export function createElementInstance<T extends AnyCustomElement>(
  definition: CustomElementDefinition<T>,
  init: CustomElementInstanceInit<InferCustomElementProps<T>> = {},
): CustomElementInstance<T> {
  type Props = InferCustomElementProps<T>;

  return root((dispose) => {
    if (init.scope) getScope()![SCOPE] = init.scope;
    if (init.context) provideContextMap(init.context);

    let accessors: Props | null = null,
      destroyed = false,
      $props = 'props' in definition ? createInstanceProps(definition.props) : {},
      $connected = signal(false),
      $mounted = signal(false),
      $attrs = {},
      $styles = {},
      setAttributes = (attrs) => void Object.assign($attrs, attrs),
      setStyles = (styles) => void Object.assign($styles, styles);

    if (init.props && 'props' in definition) {
      for (const prop of Object.keys(init.props)) {
        if (prop in definition.props) $props['$' + prop].set(init.props[prop]!);
      }
    }

    const host: CustomElementInstance['host'] = {
      [PROPS]: {
        $attrs,
        $styles,
        $connected,
        $mounted,
      },
      el: null,
      $el() {
        return $connected() ? host.el : null;
      },
      $connected,
      $mounted,
      setAttributes,
      setStyles,
      setCSSVars: setStyles,
    };

    const instance: Writable<CustomElementInstance> = {
      host,
      props: $props,
      [SCOPE]: getScope()!,
      [PROPS]: $props,
      [ATTACH]: [],
      [CONNECT]: [],
      [MOUNT]: [],
      [DESTROY]: [],
      accessors: () => (accessors ??= createAccessors($props) as Props),
      destroy() {
        if (destroyed) return;

        if (!__SERVER__) {
          $connected.set(false);
          $mounted.set(false);
          tick();

          for (const destroyCallback of instance[DESTROY]) {
            scoped(destroyCallback, instance[SCOPE]);
          }

          tick();

          for (const type of LIFECYCLES) instance[type].length = 0;
          dispose();
        } else {
          instance[ATTACH].length = 0;
          dispose();
        }

        instance[SCOPE] = null;
        instance[MEMBERS] = null;
        instance[RENDER] = null;

        (host as Writable<CustomElementHost>).el = null;
        destroyed = true;
      },
    };

    setCustomElementInstance(instance);
    instance[MEMBERS] = definition.setup(instance);
    setCustomElementInstance(null);

    const $render = instance[MEMBERS]!.$render;
    if ($render) {
      let scope!: Scope;

      // Create a new root context to prevent children from overwriting flat context tree.
      root(() => {
        provideContextMap(new Map(useContextMap()));
        scope = getScope()!;
      });

      instance[RENDER] = function render() {
        let result = null;

        scoped(() => {
          setCustomElementInstance(instance);
          result = $render();
          setCustomElementInstance(null);
        }, scope);

        return result;
      };
    }

    return instance as CustomElementInstance<T>;
  });
}

function createInstanceProps<Props>(propDefs: CustomElementPropDefinitions<Props>) {
  const props = {} as WriteSignals<Props>;

  for (const name of Object.keys(propDefs) as (keyof Props)[]) {
    const def = propDefs![name];
    props['$' + (name as string)] = signal((def as any).initial, def);
  }

  return props;
}
