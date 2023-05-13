import type * as React from 'react';
import type { PascalCase } from 'type-fest';

import type {
  Component,
  InferComponentCSSVars,
  InferComponentEvents,
  InferComponentProps,
} from '../element/component';
import type { HTMLCustomElement, InferElementComponent } from '../element/host';

export interface ReactElement<Props> extends React.ForwardRefExoticComponent<Props> {}

export type InferReactElement<T> = T extends ReactElementProps<infer E, any> ? E : never;

export type ReactElementProps<
  Element extends HTMLCustomElement = HTMLCustomElement<any>,
  Comp extends Component = InferElementComponent<Element>,
  Events = ReactElementEventCallbacks<InferComponentEvents<Comp>>,
> = {
  /** @internal types only */
  ts__element?: Element;
} & Partial<InferComponentProps<Comp>> &
  React.RefAttributes<Element> &
  Omit<React.HTMLAttributes<Element>, 'style' | keyof Events> & {
    style?:
      | (React.CSSProperties &
          Partial<InferComponentCSSVars<Comp>> & { [name: `--${string}`]: string })
      | undefined;
    children?: React.ReactNode | undefined;
    part?: string | undefined;
    __forwardedRef?: React.Ref<Element>;
  } & Events;

export interface EventHandler<Event> {
  (event: Event): void;
}

export type ReactElementEventCallbacks<Events> = {
  [EventType in keyof Events as `on${PascalCase<EventType & string>}`]?: EventHandler<
    Events[EventType]
  >;
};
