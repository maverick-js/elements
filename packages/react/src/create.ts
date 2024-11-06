import type { Component, ComponentConstructor, InferComponentEvents } from '@maverick-js/core';

import { createClientComponent } from './client-component';
import { $$_set_is_client, $$_set_is_server } from './runtime';
import { createServerComponent } from './server-component';
import type { ReactComponentBridge, ReactEventCallbacks } from './types';

if (__SERVER__) {
  $$_set_is_server(true);
} else {
  $$_set_is_client(true);
}

export interface CreateReactComponentOptions<T extends Component> {
  events?: (keyof ReactEventCallbacks<InferComponentEvents<T>>)[];
}

export function createReactComponent<T extends Component>(
  Component: ComponentConstructor<T>,
  options?: CreateReactComponentOptions<T>,
): ReactComponentBridge<T> {
  const props = new Set(Object.keys(Component.props || {}));

  if (__SERVER__) {
    return createServerComponent<T>(Component, { props });
  } else {
    return createClientComponent<T>(Component, {
      props,
      events: new Set(options?.events as string[]),
    }) as any;
  }
}
