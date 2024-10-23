import { trimQuotes } from '@maverick-js/std';
import { isJsxElementNode } from '@maverick-js/ts';
import ts from 'typescript';

import {
  type AstNode,
  type AttributeNode,
  type ElementNode,
  type EventNode,
  isElementNode,
  isExpressionNode,
  isFragmentNode,
  isTextNode,
  type TextNode,
} from './ast';
import { RESERVED_ATTR_NAMESPACE, RESERVED_NAMESPACE } from './constants';
import type { JsxAttrNamespace, JsxEventNamespace, JsxNamespace } from './jsx';
import { parse } from './parse';

export function isValidAttrNamespace(namespace: any): namespace is JsxAttrNamespace {
  return RESERVED_ATTR_NAMESPACE.has(namespace);
}

export function isValidNamespace(namespace: any): namespace is JsxNamespace {
  return RESERVED_NAMESPACE.has(namespace);
}

const eventNamespaceRE = /^\$on/;
export function isValidEventNamespace(namespace: string): namespace is JsxEventNamespace {
  return eventNamespaceRE.test(namespace);
}

export function getExpressionChildren(expression: ts.Expression) {
  const children: AstNode[] = [];
  visitExpression(expression, children);
  return children.length > 0 ? children : null;
}

function visitExpression(node: ts.Node, children: AstNode[]) {
  if (isJsxElementNode(node) || ts.isJsxFragment(node)) {
    const ast = parse(node);
    if (ast) children.push(ast);
    return;
  }

  ts.forEachChild(node, (node) => visitExpression(node, children));
}

export function filterElementNodes(children: AstNode[]) {
  return children.filter((node) => isElementNode(node) || isTextNode(node));
}

export function findElementIndex(parent: ElementNode, node: ElementNode | TextNode) {
  return filterElementNodes(parent.children!).indexOf(node);
}

export function getAttributeNodeFullName(attr: AttributeNode) {
  return `${attr.namespace ? `${attr.namespace}:` : ''}${attr.name}`;
}

export function getEventNodeFullName(event: EventNode) {
  return `${event.namespace ? `${event.namespace}:` : ''}${event.type}`;
}

export function getAttributeText(attr: AttributeNode) {
  return attr.initializer.kind !== ts.SyntaxKind.TrueKeyword
    ? trimQuotes(attr.initializer.getText())
    : '';
}

export function isStaticTree(node: AstNode) {
  if (isElementNode(node)) {
    return (
      !node.isDynamic() && !node.props && (!node.children || node.children.every(isStaticTree))
    );
  } else if (isExpressionNode(node)) {
    return !node.dynamic;
  } else {
    return isTextNode(node) || isFragmentNode(node);
  }
}

export function getElementDepth(node: AstNode, depth = 0) {
  if ((isElementNode(node) || isFragmentNode(node)) && node.children) {
    let increment = isFragmentNode(node) ? 0 : 1,
      maxDepth = depth + increment;

    for (let i = 0; i < node.children.length; i++) {
      let newDepth = getElementDepth(node.children[i], depth + increment);
      if (newDepth > maxDepth) maxDepth = newDepth;
    }

    return maxDepth;
  }

  return depth;
}
