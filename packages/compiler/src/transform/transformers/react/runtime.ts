import { filterFalsy, isArray, isString, trimQuotes } from '@maverick-js/std';
import { $, createNullFilledArgs } from '@maverick-js/ts';
import ts from 'typescript';

import {
  type AstNode,
  isElementNode,
  isExpressionNode,
  isFragmentNode,
  isTextNode,
} from '../../../parse/ast';
import { Runtime } from '../shared/runtime';
import { createStaticReactNodeProps, isReactNode, type ReactNode } from './react-node';

export class ReactRuntime extends Runtime {
  protected override pkg = '@maverick-js/react';

  get isClient() {
    return this.id('$$_IS_CLIENT');
  }

  get isServer() {
    return this.id('$$_IS_SERVER');
  }

  get suppressHydrationWarning() {
    return this.id('$$_suppress_hydration_warning');
  }

  createElement(node: ReactNode) {
    return this.h(
      node.name,
      isArray(node.props)
        ? node.props.length > 0
          ? $.object(node.props, true)
          : undefined
        : node.props,
      node.children.map((child) => (isReactNode(child) ? this.createElement(child) : child)),
    );
  }

  createStaticElement(node: AstNode): ts.Expression {
    if (isElementNode(node) && !node.isDynamic()) {
      const props =
        !node.attrs && node.content
          ? this.setHtml(node.content.initializer)
          : createStaticReactNodeProps(node);

      return this.h(
        node.name,
        isArray(props) ? $.object(props, true) : props,
        !node.content ? node.children?.map((node) => this.createStaticElement(node)) : undefined,
      );
    } else if (isFragmentNode(node)) {
      return this.h(
        this.add('ReactFragment'),
        undefined,
        node.children?.map((node) => this.createStaticElement(node)),
      );
    } else if (isTextNode(node)) {
      return $.string(node.value);
    } else if (isExpressionNode(node)) {
      return $.string(trimQuotes(node.expression.getText()));
    } else {
      throw Error('not_static');
    }
  }

  h(name: string | ts.Expression, props?: ts.Expression, children: ts.Expression[] = []) {
    return this.call(
      'h',
      filterFalsy([
        isString(name) ? $.string(name) : name,
        props ?? (children.length > 0 ? $.null : undefined),
        ...children,
      ]),
    );
  }

  attachCallback(scope: ts.Identifier, callback: ts.Expression) {
    return this.call('attach_callback', [scope, callback]);
  }

  createComponent(
    tagName: string,
    props?: ts.Expression,
    listeners?: ts.Expression,
    slots?: ts.Expression,
    onAttach?: ts.Expression,
  ) {
    return this.call(
      'create_component',
      createNullFilledArgs([
        $.id(tagName),
        props,
        listeners ? this.ifClient(listeners, $.null) : undefined,
        slots,
        onAttach,
      ]),
    );
  }

  ifClient(truthy: ts.Expression, falsy?: ts.Expression) {
    return this.#createConditionalExpression(this.isClient, truthy, falsy);
  }

  ifServer(expression: ts.Expression, falsy?: ts.Expression) {
    return this.#createConditionalExpression(this.isServer, expression, falsy);
  }

  ref() {
    return this.call('ref', []);
  }

  setHtml(content: ts.Expression) {
    return this.call('set_html', [content]);
  }

  expression(compute: ts.Expression) {
    return this.call('expression', [compute]);
  }

  appendHtml(html: ts.Expression) {
    return this.call('append_html', [html]);
  }

  ssrStyle(base: ts.Expression, props: ts.ObjectLiteralElementLike[]) {
    return this.call('ssr_style', [base, $.object(props, true)]);
  }

  ssrSpread(props: ts.Expression) {
    return this.call('ssr_spread', [props]);
  }

  onAttach(ref: ts.Identifier, callback: ts.Expression) {
    return this.call('on_attach', [ref, callback]);
  }

  #createConditionalExpression(
    condition: ts.Identifier,
    truthy: ts.Expression,
    falsy?: ts.Expression,
  ) {
    return falsy ? $.ternary(condition, truthy, falsy) : $.createLogicalAnd(condition, truthy);
  }
}
