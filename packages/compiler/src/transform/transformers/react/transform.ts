import { $ } from '@maverick-js/ts';
import ts from 'typescript';

import {
  type AstNode,
  isComponentNode,
  isElementNode,
  isExpressionNode,
  isTextNode,
} from '../../../parse/ast';
import { type Visitors, walk } from '../../../parse/walk';
import { Component } from './nodes/component';
import { Element } from './nodes/element';
import { Expression } from './nodes/expression';
import { Fragment } from './nodes/fragment';
import { Text } from './nodes/text';
import type { ReactTransformState } from './state';

export const reactVisitors: Visitors<ReactTransformState> = {
  Element,
  Component,
  Fragment,
  Expression,
  Text,
};

export function transform(
  node: AstNode,
  state: ReactTransformState,
): ts.Expression | Array<ts.Expression | ts.Statement> {
  const { runtime } = state;

  if (isTextNode(node)) {
    return $.string(node.value);
  }

  walk({ node, visitors: reactVisitors, state });

  // This will occur when the entire node is static and hoisted from inside an expression.
  if (isElementNode(node) && !state.node) {
    return state.result ?? $.null;
  }

  let result: ts.Expression;

  if (state.node) {
    result = runtime.createElement(state.node);
  } else if (isComponentNode(node) && state.result) {
    result = state.result;
  } else if (isExpressionNode(node)) {
    return state.result!;
  } else {
    result = state.result ? runtime.h(state.result) : $.null;
  }

  const setup = state.setupBlock;
  return setup.length > 0 ? [...setup, result] : result;
}
