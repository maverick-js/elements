import ts from 'typescript';

export function walkTsNode<T>(node: ts.Node, check: (child: ts.Node) => T): T | void {
  let result: T | void;

  const parse = (child: ts.Node) => {
    result = check(child);
    if (result) return result;
    return ts.forEachChild(child, parse);
  };

  return ts.forEachChild(node, parse);
}

export function findParentStatement(node: ts.Node): ts.Statement | null {
  let current: ts.Node | undefined = node;

  while (current) {
    if (ts.isStatement(current)) return current;
    current = current.parent;
  }

  return null;
}
