import { $ } from '@maverick-js/ts';

import { type ComponentNode } from '../../../../parse/ast';
import { createAttachHostCallback } from '../../dom/nodes/component';
import { createComponentProps, createComponentSlotsObject } from '../../shared/factory';
import type { ReactTransformState, ReactVisitorContext } from '../state';
import { transform } from '../transform';

export function Component(node: ComponentNode, { state }: ReactVisitorContext) {
  const { runtime, domRuntime } = state;

  const parent = state.node;
  state.node = null; // temp remove so slots create new roots.

  const $props = createComponentProps(node);

  const props = !node.spreads
      ? $props
      : domRuntime.mergeProps([...node.spreads.map((s) => s.initializer), $props]),
    propsId = node.spreads ? state.setup.vars.create('$_spread_props', props).name : undefined,
    listeners = !propsId
      ? createListenersCallback(node, state)
      : domRuntime.listenCallback(propsId),
    listenerId = propsId ? state.setup.vars.create('$_listeners', listeners).name : undefined,
    slots = createComponentSlotsObject(node, transform, (child) => state.child(child)),
    onAttach = createAttachHostCallback(node, domRuntime, propsId);

  const component = runtime.createComponent(
      node.name,
      propsId ?? props,
      listenerId ?? listeners,
      slots,
      onAttach,
    ),
    componentId = state.setup.vars.create('$_component', component).name;

  state.result = componentId;
  parent?.children.push(componentId);
  state.node = parent;
}

function createListenersCallback(node: ComponentNode, { domRuntime }: ReactTransformState) {
  if (!node.events) return;

  const id = $.id('instance');

  return $.arrowFn(
    [id],
    node.events.map((event) => domRuntime.listen(id, event.type, event.initializer, event.capture)),
  );
}
