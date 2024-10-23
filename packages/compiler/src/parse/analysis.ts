import {
  findImportSpecifierFromDeclaration,
  isValueImportDeclarationFrom,
  isValueImportSpecifier,
  removeImportSpecifiers,
} from '@maverick-js/ts';
import type ts from 'typescript';

export interface VirtualComponentImports {
  Fragment?: ts.ImportSpecifier;
  Portal?: ts.ImportSpecifier;
  For?: ts.ImportSpecifier;
  ForKeyed?: ts.ImportSpecifier;
  Host?: ts.ImportSpecifier;
}

export function isMaverickCoreImportDeclaration(node: ts.Node): node is ts.ImportDeclaration {
  return isValueImportDeclarationFrom(node, '@maverick-js/core');
}

export function findVirtualComponentImports(node: ts.ImportDeclaration): VirtualComponentImports {
  const components: VirtualComponentImports = {},
    Fragment = findImportSpecifierFromDeclaration(node, 'Fragment'),
    Portal = findImportSpecifierFromDeclaration(node, 'Portal'),
    For = findImportSpecifierFromDeclaration(node, 'For'),
    ForKeyed = findImportSpecifierFromDeclaration(node, 'ForKeyed'),
    Host = findImportSpecifierFromDeclaration(node, 'Host');

  if (isValueImportSpecifier(Fragment)) components.Fragment = Fragment;
  if (isValueImportSpecifier(Portal)) components.Portal = Portal;
  if (isValueImportSpecifier(For)) components.For = For;
  if (isValueImportSpecifier(ForKeyed)) components.ForKeyed = ForKeyed;
  if (isValueImportSpecifier(Host)) components.Host = Host;

  return components;
}

export function removeVirtualComponentImports(
  node: ts.ImportDeclaration,
  callback: (componentName: string) => void,
) {
  const components = findVirtualComponentImports(node),
    importNames = Object.values(components).map((specifier) => specifier.name.text);

  for (const name of Object.keys(components)) {
    callback(name);
  }

  if (importNames.length > 0) {
    return removeImportSpecifiers(node, importNames);
  }

  return node;
}
