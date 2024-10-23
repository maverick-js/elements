import ts from 'typescript';

import { isValueImportDeclarationFrom } from './is';

export function getNamedImportBindings(node: ts.ImportDeclaration) {
  const bindings = node.importClause?.namedBindings;
  if (bindings && ts.isNamedImports(bindings)) {
    return bindings.elements;
  }
}

export function findImportDeclarationFromModule(sourceFile: ts.SourceFile, name: string) {
  for (const statement of sourceFile.statements) {
    if (isValueImportDeclarationFrom(statement, name)) {
      return statement;
    } else if (!ts.isImportDeclaration(statement)) {
      return; // exit early
    }
  }
}

export function findImportSpecifierFromDeclaration(
  node: ts.ImportDeclaration | undefined,
  importSpecifier: string,
) {
  if (!node) return;
  const elements = getNamedImportBindings(node);
  if (!elements) return;
  return findImportSpecifierFromElements(elements, importSpecifier);
}

export function findImportSpecifierFromElements(
  elements: ts.NodeArray<ts.ImportSpecifier>,
  id: string,
) {
  return elements.find((element) => element.name.text === id);
}

export function removeImportSpecifiers(node: ts.ImportDeclaration, remove: string[]) {
  const bindings = node.importClause?.namedBindings;

  if (bindings && ts.isNamedImports(bindings)) {
    const remainingSpecifiers = bindings.elements.filter(
      (specifier) => !remove.includes(specifier.name.text),
    );

    // If no specifiers are left, remove the entire import declaration.
    if (remainingSpecifiers.length === 0) {
      return undefined;
    }

    const updatedNamedImports = ts.factory.updateNamedImports(bindings, remainingSpecifiers);

    const updatedImportClause = ts.factory.updateImportClause(
      node.importClause,
      node.importClause.isTypeOnly,
      node.importClause.name,
      updatedNamedImports,
    );

    return ts.factory.updateImportDeclaration(
      node,
      node.modifiers,
      updatedImportClause,
      node.moduleSpecifier,
      node.attributes,
    );
  }

  return node;
}
