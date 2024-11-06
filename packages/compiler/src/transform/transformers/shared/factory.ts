import { isArray } from '@maverick-js/std';
import { $, replaceTsNodes, type TsNodeMap } from '@maverick-js/ts';
import ts from 'typescript';

import {
  type AstNode,
  type AttributeNode,
  type ComponentNode,
  type ElementNode,
  type EventNode,
  type InferTsNode,
  isExpressionNode,
  type RefNode,
} from '../../../parse/ast';
import { getAttributeNodeFullName, getEventNodeFullName } from '../../../parse/utils';
import type { NextState } from '../../../parse/walk';
import type { StateTransform, StateTransformResult } from '../transformer';

export function createComponentProps(node: ComponentNode) {
  if (!node.props?.length) return;
  return $.object(createComponentPropsList(node), true);
}

export function createComponentPropsList(node: ComponentNode) {
  return createAttributePropertyAssignmentList(node.props);
}

export function createComponentHostProps(node: ComponentNode, { ssr = false } = {}) {
  const props: ts.PropertyAssignment[] = [];

  if (node.class) {
    props.push($.createPropertyAssignment('class', node.class.initializer));
  }

  props.push(
    ...createAttributePropertyAssignmentList(node.classes),
    ...createAttributePropertyAssignmentList(node.vars),
  );

  if (!ssr) {
    props.push(...createEventPropertyAssignmentList(node.events));
  }

  if (!props.length) return;

  return $.object(props, true);
}

export function createComponentSlotsObject<State>(
  component: ComponentNode,
  transform: StateTransform<State>,
  nextState: NextState<State>,
  resolve?: (
    slot: AstNode,
    state: State,
    result: NonNullable<StateTransformResult>,
    resolve: (node: StateTransformResult) => ts.Expression,
  ) => ts.Expression,
) {
  if (!component.slots) return;

  const { slots } = component;

  return $.object(
    Object.keys(slots).map((slotName) => {
      let slot = slots[slotName],
        name = $.string(slotName),
        state = nextState(slot),
        result = transform(slot, state) ?? $.null;

      if (resolve) {
        result = resolve(slot, state, result, (node) => resolveSlot(slot, node));
      } else {
        result = resolveSlot(slot, result);
      }

      return $.createPropertyAssignment(name, result);
    }),
    true,
  );
}

function resolveSlot(slot: AstNode, result: StateTransformResult = $.null) {
  const renderFunction =
      isExpressionNode(slot) && ts.isArrowFunction(slot.expression) ? slot.expression : null,
    params = renderFunction?.parameters ?? [];

  if (isArray(result)) {
    returnLastExpression(result);
    return $.arrowFn(params, result);
  } else if (ts.isArrowFunction(result) || renderFunction) {
    return result;
  } else {
    return $.arrowFn(params, result);
  }
}

export function isHigherOrderExpression(node: AstNode) {
  return isExpressionNode(node) && node.children && !ts.isArrowFunction(node.expression);
}

export function createElementSpreadProps(node: ElementNode, { ssr = false } = {}) {
  const props: ts.PropertyAssignment[] = [];

  props.push(
    ...createAttributePropertyAssignmentList(node.attrs),
    ...createAttributePropertyAssignmentList(node.classes),
    ...createAttributePropertyAssignmentList(node.styles),
    ...createAttributePropertyAssignmentList(node.vars),
  );

  if (!ssr) {
    props.push(...createAttributePropertyAssignmentList(node.props));

    if (node.content) {
      props.push(
        $.createPropertyAssignment(
          $.string(`content:${node.content.name}`),
          node.content.initializer,
        ),
      );
    }

    props.push(...createEventPropertyAssignmentList(node.events));

    if (node.ref) {
      props.push(createRefPropertyAssignment(node.ref));
    }
  }

  return props.length > 0 ? $.object(props, true) : undefined;
}

export function createAttributePropertyAssignmentList(attrs?: AttributeNode[]) {
  return (attrs ?? []).map((attr) => createAttributePropertyAssignment(attr));
}

export function createAttributePropertyAssignment(attr: AttributeNode) {
  const name = getAttributeNodeFullName(attr);
  return $.createPropertyAssignment($.string(name), attr.initializer);
}

export function createEventPropertyAssignmentList(events?: EventNode[]) {
  return (events ?? []).map(createEventPropertyAssignment);
}
export function createEventPropertyAssignment(event: EventNode) {
  return $.createPropertyAssignment($.string(getEventNodeFullName(event)), event.initializer);
}

export function createRefPropertyAssignment(node: RefNode) {
  return $.createPropertyAssignment($.id('ref'), node.initializer);
}

export function transformAstNodeChildren<Node extends AstNode, State>(
  node: Node,
  transform: StateTransform<State>,
  nextState: NextState<State>,
): InferTsNode<Node> {
  const map: TsNodeMap = new Map(),
    root = isExpressionNode(node) ? node.expression : node.node;

  if ('children' in node && node.children) {
    for (const child of node.children) {
      let replacedNode = ts.isParenthesizedExpression(child.node.parent)
          ? child.node.parent
          : child.node,
        result = transform(child, nextState(child));

      if (isArray(result)) {
        returnLastExpression(result);
        result =
          ts.isArrowFunction(root) && root.body === replacedNode
            ? ($.block(result) as any)
            : $.selfInvokedFn(result);
      }

      map.set(replacedNode, result);
    }
  }

  return replaceTsNodes(root, map) as InferTsNode<Node>;
}

export function returnLastExpression(nodes: Array<ts.Expression | ts.Statement>) {
  const lastNode = nodes.at(-1);
  if (lastNode && ts.isExpression(lastNode)) {
    nodes[nodes.length - 1] = $.createReturnStatement(lastNode);
  }
}
