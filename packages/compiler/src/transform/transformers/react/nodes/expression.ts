import { trimQuotes } from '@maverick-js/std';
import { $ } from '@maverick-js/ts';
import ts from 'typescript';

import { type ExpressionNode } from '../../../../parse/ast';
import { transformAstNodeChildren } from '../../shared/factory';
import type { ReactVisitorContext } from '../state';
import { transform } from '../transform';

export function Expression(node: ExpressionNode, { state }: ReactVisitorContext) {
  const { runtime } = state,
    isRenderFunction = state.isComponentChild && ts.isArrowFunction(node.expression);

  if (node.children) {
    const parent = state.node;
    state.node = null; // temp remove so children create new roots.

    // Transform all child JSX elements.
    node.expression = transformAstNodeChildren(node, transform, (node) => state.child(node));

    state.node = parent;
  }

  if (!node.dynamic) {
    if (state.node) {
      state.node.children.push($.string(trimQuotes(node.expression.getText())));
    } else {
      state.result = node.expression;
    }
  } else {
    const expression = isRenderFunction ? node.expression : runtime.expression(node.expression);
    state.node?.children.push(expression);
    state.result = expression;
  }
}
