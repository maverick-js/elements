import { isFunction } from '@maverick-js/std';
import type { WritableKeysOf } from 'type-fest';

import type { JSX } from '../jsx/jsx';
import { ViewController } from './controller';
import type { CustomElementOptions } from './custom-element/types';
import { Instance } from './instance';
import {
  ATTACH_SYMBOL,
  type AttachCallback,
  type ComponentLifecycleEvents,
  RENDER_SYMBOL,
} from './lifecycle';
import { type Dispose, effect, type Maybe, scoped } from './signals';
import type { StoreFactory } from './store';
import type { DEFINE_ELEMENT_SYMBOL } from './symbols';

const COMPONENT_CTOR_SYMBOL = /* #__PURE__ */ Symbol.for('maverick.component.ctor');

export class Component<Meta extends ComponentMeta = ComponentMeta> extends ViewController<Meta> {
  static [COMPONENT_CTOR_SYMBOL] = true;

  /** @internal - DO NOT USE (type holder only) */
  $$ts__meta?: Meta;

  /** @internal - DO NOT USE (for jsx types only) */
  jsxProps!: JSX.ClassComponentAttributes<Meta>;

  render?(): JSX.Element;

  [RENDER_SYMBOL]() {
    if (!this.render) return null;
    return scoped(() => this.render!(), this.scope);
  }

  subscribe(callback: (state: Readonly<ResolveMetaState<Meta>>) => Maybe<Dispose>) {
    if (__DEV__ && !this.state) {
      const name = this.constructor.name;
      throw Error(
        `[maverick]: component \`${name}\` can not be subscribed to because it has no internal state`,
      );
    }

    return scoped(() => effect(() => callback(this.state)), this.$$.scope)!;
  }

  destroy(): void {
    this.$$.destroy();
  }
}

export function isComponentConstructor(value: unknown): value is ComponentConstructor {
  return isFunction(value) && COMPONENT_CTOR_SYMBOL in value;
}

export interface AnyComponent extends Component<AnyComponentMeta> {}

export interface ComponentConstructor<T extends Component = AnyComponent> {
  readonly element?: CustomElementOptions<T>;
  readonly props?: InferComponentProps<T>;
  readonly state?: StoreFactory<InferComponentState<T>>;
  [DEFINE_ELEMENT_SYMBOL]?(): void;
  new (): T;
}

export type InferComponent<T> = T extends ComponentConstructor<infer Component> ? Component : never;

export interface AnyComponentMeta extends ComponentMeta<any, any, any, any> {}

export interface ComponentMeta<Props = {}, State = {}, Events = {}, CssProps = {}> {
  props?: Props;
  state?: State;
  events?: Events;
  cssProps?: CssProps;
}

export type ResolveMetaProps<T extends ComponentMeta> = NonNullable<T['props']>;
export type ResolveMetaState<T extends ComponentMeta> = NonNullable<T['state']>;
export type ResolveMetaEvents<T extends ComponentMeta> = NonNullable<T['events']>;
export type ResolveMetaCssProps<T extends ComponentMeta> = NonNullable<T['cssProps']>;

export type InferComponentMeta<T> = T extends Component<infer Meta> ? Meta : never;
export type InferComponentProps<T> = ResolveMetaProps<InferComponentMeta<T>>;
export type InferComponentState<T> = ResolveMetaState<InferComponentMeta<T>>;
export type InferComponentEvents<T> = ResolveMetaEvents<InferComponentMeta<T>> &
  ComponentLifecycleEvents;
export type InferComponentCssProps<T> = ResolveMetaCssProps<InferComponentMeta<T>>;

export type InferComponentMembers<T> = Omit<InferComponentProps<T>, keyof T> &
  Omit<T, keyof Component>;

export type InferComponentCssVars<
  Component extends AnyComponent,
  CSSProps = InferComponentCssProps<Component>,
> = { [Var in WritableKeysOf<CSSProps> as `--${Var & string}`]: CSSProps[Var] };

export type InferComponentInstance<T> = Instance<InferComponentProps<T>, InferComponentState<T>>;

/**
 * Priority attach callbacks that need to be at the front of the queue.
 *
 * @internal
 */
export function $$_priority_attach(component: AnyComponent, callback: AttachCallback) {
  component.$$[ATTACH_SYMBOL].unshift(callback);
}
