import { isArray } from '@maverick-js/std';
import {
  $,
  addStatementsToBlock,
  type BlockUpdate,
  isJsxRootNode,
  replaceTsNode,
  resetUniqueIdCount,
  splitImportsAndBody,
  transformTsNode,
  updateBlock,
} from '@maverick-js/ts';
import ts from 'typescript';

import {
  isMaverickCoreImportDeclaration,
  removeVirtualComponentImports,
} from '../../../parse/analysis';
import { parse } from '../../../parse/parse';
import { createDelegateEventsStatement } from '../dom/transformer';
import { returnLastExpression } from '../shared/factory';
import type { Transform, TransformData } from '../transformer';
import { ReactTransformState } from './state';
import { transform } from './transform';

export interface ReactTransformOptions {
  /**
   * A single event listener is attached to the document to manage expensive events on multiple
   * child elements. Instead of adding individual listeners to each child, the event "bubbles" up
   * from the target element to the document, where the listener can capture and handle it. This
   * improves performance, especially in dynamic interfaces, by reducing the number of event
   * listeners.
   */
  delegateEvents?: boolean;
}

export function createReactTransform(options?: ReactTransformOptions): Transform {
  return (data) => reactTransform(data, options);
}

export function reactTransform(
  { sourceFile }: TransformData,
  { delegateEvents }: ReactTransformOptions = {},
) {
  let state = new ReactTransformState(null),
    seenImports = false,
    blocks: BlockUpdate[][] = [];

  function visit(this: ts.TransformationContext, node: ts.Node) {
    if (!seenImports && isMaverickCoreImportDeclaration(node)) {
      seenImports = true;
      return removeVirtualComponentImports(node, (name) => state.runtime.add(name));
    } else if (ts.isBlock(node) || ts.isModuleBlock(node)) {
      const updates: BlockUpdate[] = [];

      blocks.push(updates);
      const block = ts.visitEachChild(node, visit, this);
      blocks.pop();

      return updateBlock(block, updates);
    } else if (isJsxRootNode(node)) {
      const ast = parse(node),
        result = ast ? transform(ast, state.child(ast)) : $.null,
        currentBlock = blocks.at(-1);

      resetUniqueIdCount();

      if (currentBlock) {
        if (isArray(result)) {
          const statements = result.slice(0, -1);

          currentBlock.push({
            type: 'add',
            statements,
            before: node,
          });

          currentBlock.push({
            type: 'replace',
            old: node,
            new: result.at(-1)!,
          });
        } else {
          currentBlock.push({
            type: 'replace',
            old: node,
            new: result,
          });
        }

        // Return original block and transform above.
        return node;
      }

      if (isArray(result)) {
        returnLastExpression(result);
        return $.selfInvokedFn(result);
      }

      return result;
    }

    return ts.visitEachChild(node, visit, this);
  }

  const transformedSourceFile = transformTsNode(sourceFile, (ctx) => visit.bind(ctx)),
    { imports, body } = splitImportsAndBody(transformedSourceFile);

  if (delegateEvents && state.delegatedEvents.size > 0) {
    body.push(createDelegateEventsStatement(state.delegatedEvents, state.domRuntime));
  }

  const statements: ts.Statement[] = [];

  const runtimes = [state.runtime, state.domRuntime, state.ssrRuntime];
  for (const runtime of runtimes) {
    if (runtime.identifiers.length > 0) {
      statements.push(runtime.toImportDeclaration());
    }
  }

  if (state.module.vars.length > 0) {
    statements.push(state.module.vars.toStatement());
  }

  return $.updateSourceFile(sourceFile, [
    ...imports,
    ...statements,
    ...state.module.block,
    ...body,
  ]);
}
