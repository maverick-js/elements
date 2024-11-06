import {
  Component,
  type InferComponentCssVars,
  type InferComponentEvents,
  type InferComponentProps,
} from '@maverick-js/core';
import type { InferEventDetail, Optional } from '@maverick-js/std';
import type * as React from 'react';
import type { PascalCase } from 'type-fest';

export interface ReactComponent<C extends Component> {
  (props: ReactProps<C>): React.ReactNode;
}

export interface ReactComponentBridge<C extends Component> {
  displayName?: string;
  (props: ReactBridgeProps<C>): React.ReactNode;
}

export type ReactProps<
  C extends Component,
  E = ReactEventCallbacks<InferComponentEvents<C>>,
> = Optional<InferComponentProps<C>> &
  E & {
    style?:
      | ((React.CSSProperties & { [name: `--${string}`]: string | number | null | undefined }) &
          Optional<InferComponentCssVars<C>>)
      | undefined;
    part?: string | undefined;
  };

export type ReactBridgeProps<C extends Component> = ReactProps<C> & {
  className?: string;
  ref?: React.Ref<C>;
  forwardRef?: React.Ref<C>;
  children?:
    | React.ReactNode
    | ((
        props: React.HTMLAttributes<HTMLElement> & React.RefAttributes<any>,
        component: C,
      ) => React.ReactNode);
};

export type ReactElementProps<
  C extends Component,
  T extends HTMLElement | SVGElement = HTMLElement,
  E = ReactEventCallbacks<InferComponentEvents<C>>,
> = ReactProps<C, E> &
  Omit<T extends HTMLElement ? React.HTMLAttributes<T> : React.SVGAttributes<T>, 'style' | keyof E>;

export type ReactEventCallbacks<E> = {
  [Type in keyof E as `on${PascalCase<Type & string>}`]?:
    | (InferEventDetail<E[Type]> extends void
        ? (nativeEvent: E[Type]) => void
        : (detail: InferEventDetail<E[Type]>, nativeEvent: E[Type]) => void)
    | undefined;
};

export type InferReactElement<T> = T extends ReactElementProps<any, infer E, any> ? E : never;
