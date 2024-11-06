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

  readonly module: Readonly<{
    vars: Variables;
    block: Array<ts.Statement>;
  }>;

  readonly setup: Readonly<{
    vars: Variables;
    block: Array<ts.Expression | ts.Statement>;
  }>;

  readonly delegatedEvents: Set<string>;
  readonly children: ReactTransformState[] = [];
  readonly isComponentChild: boolean;

  node: ReactNode | null = null;
  result: ts.Expression | null = null;

  constructor(root: AstNode | null, init?: Partial<ReactTransformState>) {
    this.root = root;

    this.runtime = init?.runtime ?? new ReactRuntime();
    this.domRuntime = init?.domRuntime ?? new DomRuntime();
    this.ssrRuntime = init?.ssrRuntime ?? new SsrRuntime();

    this.module = init?.module ?? {
      vars: new Variables(),
      block: [],
    };

    const parent = init?.root,
      isComponentChild = !!parent && isComponentNode(parent),
      isExpressionChild = !!parent && isExpressionNode(parent),
      isNewSetupScope = !init?.setup || isComponentChild || isExpressionChild;

    this.isComponentChild = isComponentChild;
    this.setup = isNewSetupScope ? { vars: new Variables(), block: [] } : init.setup;

    this.node = init?.node ?? null;
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
}

export interface ReactVisitorContext extends VisitorContext<ReactTransformState> {}

export function createReactTransformState(
  root: AstNode | null,
  init?: Partial<ReactTransformState>,
) {
  return new ReactTransformState(root, init);
}
