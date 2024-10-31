import { $ } from '@maverick-js/ts';
import ts from 'typescript';

import { type AstNode, isComponentNode, isExpressionNode } from '../../../parse/ast';
import type { VisitorContext, Walker } from '../../../parse/walk';
import { DomRuntime } from '../dom/runtime';
import { Variables } from '../shared/variables';
import { SsrRuntime } from '../ssr/runtime';
import type { ReactNode } from './react-node';
import { ReactRuntime } from './runtime';

export class ReactTransformState {
  readonly root: AstNode | null;

  readonly runtime: ReactRuntime;
  readonly domRuntime: DomRuntime;
  readonly ssrRuntime: SsrRuntime;

  // Module-scope code.
  readonly module: Readonly<{
    vars: Variables;
    block: Array<ts.Statement>;
  }>;

  // Top-level setup code that should run once per initialization.
  readonly setup: Readonly<{
    scope: ts.Identifier | null;
    vars: Variables;
    block: Array<ts.Expression | ts.FunctionDeclaration>;
  }>;

  // Render code that should run on each tick.
  readonly render: Readonly<{
    args: Set<string>;
    allArgs: Set<string>;
    binds: Set<string>;
    vars: Variables;
    block: Array<ts.Expression | ts.FunctionDeclaration>;
  }>;

  readonly isChild: boolean;
  readonly isExpressionChild: boolean | null = null;
  isSlot = false;
  readonly isRenderFunctionChild: boolean;

  readonly delegatedEvents: Set<string>;
  readonly children: ReactTransformState[] = [];

  node: ReactNode | null = null;
  result: ts.Expression | null = null;

  constructor(root: AstNode | null, init?: Partial<ReactTransformState>) {
    const parent = init?.root,
      // Component slots and expression children have their own render scopes.
      isComponentChild = parent && isComponentNode(parent),
      isExpressionChild = parent && isExpressionNode(parent),
      isNewRenderScope = !init?.render || isComponentChild || isExpressionChild,
      isRenderFunction = root && isExpressionNode(root) && ts.isArrowFunction(root.expression);

    this.root = root;

    this.runtime = init?.runtime ?? new ReactRuntime();
    this.domRuntime = init?.domRuntime ?? new DomRuntime();
    this.ssrRuntime = init?.ssrRuntime ?? new SsrRuntime();

    this.module = init?.module ?? {
      vars: new Variables(),
      block: [],
    };

    this.setup = init?.setup ?? {
      scope: null,
      vars: new Variables(),
      block: [],
    };

    this.render = isNewRenderScope
      ? {
          args: (!isRenderFunction && init?.render?.args) || new Set(),
          allArgs: init?.render?.allArgs ?? new Set(),
          binds: new Set(),
          vars: new Variables(),
          block: [],
        }
      : init.render;

    this.node = init?.node ?? null;

    this.isChild = !!parent;
    this.isRenderFunctionChild = !!isExpressionChild && ts.isArrowFunction(parent.expression);

    // Push this value down to grandchildren.
    if (init?.isExpressionChild || isExpressionChild) {
      this.isExpressionChild = true;
    }

    this.delegatedEvents = init?.delegatedEvents ?? new Set();
  }

  appendNode(child: ReactNode, walk?: Walker<ReactTransformState>) {
    const parent = this.node;
    this.node = child;

    walk?.children(this.child.bind(this));

    if (parent) {
      this.node = parent;
      parent.children.push(child);
    }
  }

  child(root: AstNode) {
    const childState = new ReactTransformState(root, this);
    this.children.push(childState);
    return childState;
  }

  walk<T>(callback: (state: ReactTransformState) => T) {
    for (const childState of this.children) {
      callback(childState);
      childState.walk(callback);
    }
  }

  get currentScope() {
    if (this.isSlot || this.render.allArgs.size > 0) {
      return $.id('this');
    }

    return this.setupScope;
  }

  get setupScope() {
    if (this.setup.scope) {
      return this.setup.scope;
    }

    const id = this.setup.vars.create('$_scope', this.runtime.getScope()).name;

    // @ts-expect-error - override readonly
    this.setup.scope = id;

    return id;
  }

  get setupBlock() {
    const block: Array<ts.Expression | ts.Statement> = [];

    if (this.setup.vars.length > 0) {
      block.push(this.setup.vars.toStatement());
    }

    if (this.setup.block.length > 0) {
      block.push(...this.setup.block);
    }

    return block;
  }

  get renderBlock() {
    const block: Array<ts.Expression | ts.Statement> = [];

    if (this.render.vars.length > 0) {
      block.push(this.render.vars.toStatement());
    }

    if (this.render.block.length > 0) {
      block.push(...this.render.block);
    }

    return block;
  }
}

export interface ReactVisitorContext extends VisitorContext<ReactTransformState> {}

export function createReactTransformState(
  root: AstNode | null,
  init?: Partial<ReactTransformState>,
) {
  return new ReactTransformState(root, init);
}
