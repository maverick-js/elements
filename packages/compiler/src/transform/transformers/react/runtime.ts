import { filterFalsy, isArray, isString, trimQuotes } from '@maverick-js/std';
import { $, createNullFilledArgs, isAccessExpression } from '@maverick-js/ts';
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
        listeners ? this.ifClient(listeners) : undefined,
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

  setHtml(content: ts.Expression) {
    return this.call('set_html', [content]);
  }

  getScope() {
    return this.call('get_scope');
  }

  get componentScope() {
    return this.id('$$_component_scope');
  }

  memo(scope: ts.Expression, compute: ts.Expression, deps?: ts.Expression[]) {
    return this.#createCompute('memo', scope, compute, deps);
  }

  signal(value: ts.Expression) {
    return this.call('signal', [value]);
  }

  computed(compute: ts.Expression | ts.Block, deps?: ts.Expression[]) {
    return this.#createCompute('computed', null, compute, deps);
  }

  expression(compute: ts.Expression, deps?: ts.Expression[]) {
    return this.#createCompute('expression', null, compute, deps);
  }

  appendHtml(html: ts.Expression) {
    return this.call('append_html', [html]);
  }

  style(base: ts.Expression, props: ts.ObjectLiteralElementLike[]) {
    return this.call('style', [base, $.object(props, true)]);
  }

  spread(props: ts.Expression) {
    return this.call('spread', [props]);
  }

  onAttach(ref: ts.Identifier, callback: ts.Expression) {
    return this.call('on_attach', [ref, callback]);
  }

  #createCompute(
    id: string,
    scope: ts.Expression | null,
    compute: ts.Expression | ts.Block,
    deps?: ts.Expression[],
  ) {
    const callback = this.#createComputeCallback(compute),
      args = deps?.length ? [callback, $.array(deps)] : [callback];
    return this.call(id, scope ? [scope, ...args] : args);
  }

  #createComputeCallback(compute: ts.Expression | ts.Block) {
    if (isAccessExpression(compute)) {
      return compute;
    } else {
      return $.arrowFn([], compute);
    }
  }

  #createConditionalExpression(
    condition: ts.Identifier,
    truthy: ts.Expression,
    falsy?: ts.Expression,
  ) {
    return falsy ? $.ternary(condition, truthy, falsy) : $.createLogicalAnd(condition, truthy);
  }
}
