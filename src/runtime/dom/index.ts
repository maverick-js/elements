import { isFunction } from '../../utils/unit';

/** @internal */
export function $$_template(html: string, isSVG = false) {
  //
}

/** @internal */
export function $$_element(template: HTMLTemplateElement) {
  //
}

/** @internal */
export function $$_component(component: () => Node, props?: Record<string, any>) {
  //
}

/** @internal */
export function $$_markers(node: Node) {
  //
}

/** @internal */
export function $$_directive(
  node: Node,
  directive: (ref: Node, args: any[]) => void,
  args: unknown[],
) {
  //
}

/** @internal */
export function $$_insert(marker: Comment, value: unknown) {
  //
}

/** @internal */
export function $$_listen(
  node: Node,
  type: string,
  handler: unknown,
  delegate = false,
  capture = false,
) {
  //
}

/** @internal */
export function $$_ref(node: Node, refs: (node: Node) => void | ((node: Node) => void)[]) {
  //
}

/** @internal */
export function $$_attr(node: Node, name: string, value: unknown) {
  //
}

/** @internal */
export function $$_prop(node: Node, name: string, value: unknown) {
  if (isFunction(node)) {
    // ...
  } else {
    //
  }
}

/** @internal */
export function $$_class(node: Node, name: string, value: unknown) {
  //
}

/** @internal */
export function $$_style(node: Node, name: string, value: unknown) {
  //
}

/** @internal */
export function $$_cssvar(node: Node, name: string, value: unknown) {
  //
}

/** @internal */
export function $$_spread(node: Node, name: string, value: unknown) {
  //
}

/** @internal */
export function $$_merge_props(...props: Record<string, any>[]) {
  //
}

/** @internal */
export function $$_delegate_events(types: string[]) {
  //
}

/** @internal */
export function $$_run_hydration_events() {
  //
}
