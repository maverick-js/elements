import { trimQuotes } from '@maverick-js/std';
import ts from 'typescript';

import { findIdentifiers } from './bindings';
import type { JsxElementNode } from './types';

export function isComponentTagName(tagName: string) {
  return (
    !tagName.includes('-') &&
    ((tagName[0] && tagName[0].toLowerCase() !== tagName[0]) ||
      tagName.includes('.') ||
      /[^a-zA-Z]/.test(tagName[0]))
  );
}

export function isTrueKeyword(node: ts.Node) {
  return node.kind === ts.SyntaxKind.TrueKeyword;
}

export function isFalseKeyword(node: ts.Node) {
  return node.kind === ts.SyntaxKind.FalseKeyword;
}

export function isBoolLiteral(node: ts.Node) {
  return isTrueKeyword(node) || isFalseKeyword(node);
}

export function isNullNode(node: ts.Node): node is ts.NullLiteral {
  return node.kind === ts.SyntaxKind.NullKeyword;
}

export function isUndefinedNode(node: ts.Node): node is ts.Identifier {
  return isIdentifierWithText(node, 'undefined');
}

export function isNullishNode(node: ts.Node) {
  return isNullNode(node) || isUndefinedNode(node);
}

export function isLogicalAndExpression(node: ts.Node): node is ts.BinaryExpression {
  return (
    ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken
  );
}

export function isNullishCoalescing(node: ts.Node): node is ts.BinaryExpression {
  return (
    ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken
  );
}

export function isLogicalOrExpression(node: ts.Node): node is ts.BinaryExpression {
  return ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.BarBarToken;
}

export function isStringLiteral(node: ts.Node) {
  return ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node);
}

export function isStaticLiteralNode(node: ts.Node) {
  return (
    ts.isLiteralExpression(node) ||
    ts.isNumericLiteral(node) ||
    isStringLiteral(node) ||
    isBoolLiteral(node)
  );
}

export function isEmptyNode(node: ts.Node) {
  const text = trimQuotes(node.getText().trim());
  return text.length === 0 || text === '() => {}';
}

export function isEmptyExpressionNode(node: ts.Node) {
  return ts.isJsxExpression(node) && isEmptyNode(node);
}

export function isEmptyTextNode(node: ts.Node) {
  return ts.isJsxText(node) && (isEmptyNode(node) || /^[\r\n]\s*$/.test(node.getText()));
}

export function isJsxElementNode(node: ts.Node): node is JsxElementNode {
  return ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node);
}

export function isJsxRootNode(node: ts.Node) {
  return isJsxElementNode(node) || ts.isJsxFragment(node);
}

export function isValueImportDeclarationFrom(
  node: ts.Node,
  moduleSpecifier: string,
): node is ts.ImportDeclaration {
  return (
    ts.isImportDeclaration(node) &&
    !node.importClause?.isTypeOnly &&
    ts.isStringLiteral(node.moduleSpecifier) &&
    node.moduleSpecifier.text === moduleSpecifier
  );
}

export function isValueImportSpecifier(
  specifier: ts.ImportSpecifier | undefined,
): specifier is ts.ImportSpecifier {
  return !!specifier && !specifier.isTypeOnly;
}

export function isTypeImportSpecifier(
  specifier: ts.ImportSpecifier | undefined,
): specifier is ts.ImportSpecifier {
  return !isValueImportSpecifier(specifier);
}

export function isIdentifierWithText(
  node: ts.Node | undefined,
  text: string,
): node is ts.Identifier {
  return !!node && ts.isIdentifier(node) && node.text === text;
}

export function isIdentifierEqual(a: ts.Identifier, b: ts.Identifier) {
  return a.text === b.text;
}

export function isStaticPropDeclaration(node: ts.Node): node is ts.PropertyDeclaration {
  return (
    ts.isPropertyDeclaration(node) &&
    !!node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword)
  );
}

export function isCallExpressionWithName(node: ts.Node, name: string): node is ts.CallExpression {
  return ts.isCallExpression(node) && isIdentifierWithText(node.expression, name);
}

export type AccessExpression =
  | ts.Identifier
  | ts.PropertyAccessExpression
  | ts.ElementAccessExpression;

export function isAccessExpression(node: ts.Node): node is AccessExpression {
  return (
    ts.isIdentifier(node) ||
    ts.isPropertyAccessExpression(node) ||
    ts.isElementAccessExpression(node)
  );
}

export function isAccessExpressionEqual(a: AccessExpression, b: AccessExpression) {
  const aIdentifiers = findIdentifiers(a),
    bIdentifiers = findIdentifiers(b);

  if (aIdentifiers.length !== bIdentifiers.length) return false;

  for (let i = 0; i < aIdentifiers.length; i += 1) {
    if (aIdentifiers[i].text !== bIdentifiers[i].text) {
      return false;
    }
  }

  return true;
}

export function isFunctionModuleScope(sourceFile: ts.SourceFile, id: ts.Identifier) {
  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause,
        bindings = clause?.namedBindings;

      if (clause && clause.name?.text === id.text) {
        return true;
      }

      return (
        bindings &&
        ts.isNamedImports(bindings) &&
        bindings.elements.some((el) => el.name.text === id.text)
      );
    } else if (ts.isFunctionDeclaration(statement)) {
      return statement.name?.text === id.text;
    }
  }

  return false;
}
