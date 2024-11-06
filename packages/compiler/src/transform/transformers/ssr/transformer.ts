import { isArray } from '@maverick-js/std';
import {
  $,
  addStatementsToBlock,
  type BlockUpdate,
  createStatements,
  isJsxRootNode,
  replaceTsNodes,
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
import { setupCustomElements } from '../shared/element';
import { returnLastExpression } from '../shared/factory';
import type { Transform, TransformData } from '../transformer';
import { SsrTransformState } from './state';
import { transform } from './transform';

export interface SsrTransformOptions {
  /**
   * Whether to mark components with a static `element` property declaration to be
   * rendered as a custom element.
   */
  customElements?: boolean;
}

export function createSsrTransform(options?: SsrTransformOptions): Transform {
  return (data) => ssrTransform(data, options);
}

export function ssrTransform(
  { sourceFile }: TransformData,
  { customElements }: SsrTransformOptions = {},
) {
  let state = new SsrTransformState(null),
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

      if (currentBlock) {
        if (isArray(result)) {
          const setup = result.slice(0, -1);

          currentBlock.push({
            type: 'add',
            statements: setup,
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

  const statements: ts.Statement[] = [];

  if (state.runtime.identifiers.length > 0) {
    statements.push(state.runtime.toImportDeclaration());
  }

  addTemplateVariables(state);
  if (state.vars.module.length > 0) {
    statements.push(state.vars.module.toStatement());
  }

  const updatedSourceFile = $.updateSourceFile(transformedSourceFile, [
    ...imports,
    ...statements,
    ...body,
  ]);

  return customElements
    ? setupCustomElements(updatedSourceFile, registerCustomElement)
    : updatedSourceFile;
}

function registerCustomElement() {
  return $.createTrue();
}

function addTemplateVariables(state: SsrTransformState) {
  state.walk(({ template, statics }) => {
    if (template && statics.length > 0) {
      state.vars.module.create(template, $.array(statics));
    }
  });
}
