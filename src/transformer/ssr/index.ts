import { encode } from 'html-entities';
import kleur from 'kleur';
import { escape } from '../../utils/html';
import {
  createFunctionCall,
  createObjectLiteral,
  escapeDoubleQuotes,
  trimQuotes,
  trimTrailingSemicolon,
} from '../../utils/print';
import {
  type ElementNode,
  type AttributeNode,
  type SpreadNode,
  isElementNode,
  isAttributeNode,
  isSpreadNode,
  isTextNode,
  isExpressionNode,
  isStructuralNode,
  isElementEnd,
  isAttributesEnd,
  isFragmentNode,
} from '../ast';
import {
  serializeChildren,
  serializeComponentChildrenProp,
  serializeComponentProp,
  serializeParentExpression,
} from '../jsx/utils';
import type { ASTSerializer } from '../transform';

const HYDRATION_MARKER = '<!$>';

const ID = {
  template: '$$_templ',
};

const RUNTIME = {
  createComponent: '$$_create_component',
  customElement: '$$_custom_element',
  ssr: '$$_ssr',
  attr: '$$_attr',
  classes: '$$_classes',
  styles: '$$_styles',
  spread: '$$_spread',
  mergeProps: '$$_merge_props',
};

export const ssr: ASTSerializer = {
  serialize(ast, ctx) {
    let template = '',
      merging = false,
      templates: string[] = [],
      parts: string[] = [],
      classes: AttributeNode[] = [],
      styles: AttributeNode[] = [],
      props: string[] = [],
      merger: (AttributeNode | SpreadNode)[] = [],
      spreads: string[] = [],
      elements: ElementNode[] = [],
      component!: ElementNode | undefined,
      customElement!: ElementNode | undefined,
      commit = (part: string) => {
        parts.push(part);
        templates.push(template);
        template = '';
      },
      marker = () => {
        template += HYDRATION_MARKER;
      };

    const firstNode = ast.tree[0],
      isFirstNodeElement = isElementNode(firstNode),
      isFirstNodeComponent = isFirstNodeElement && firstNode.isComponent,
      isFirstNodeFragment = isFragmentNode(firstNode);

    if (isFirstNodeElement && !firstNode.isComponent) {
      template += HYDRATION_MARKER;
    }

    for (let i = 0; i < ast.tree.length; i++) {
      const node = ast.tree[i];

      if (component) {
        if (isAttributeNode(node) && !node.namespace) {
          props.push(serializeComponentProp(node));
        } else if (isSpreadNode(node)) {
          spreads.push(node.value);
        } else if (isStructuralNode(node) && isElementEnd(node)) {
          const children = component.children;

          if (children) {
            props.push(serializeComponentChildrenProp(ssr, children, ctx));
          }

          const hasProps = props.length > 0;
          const hasSpreads = spreads.length > 0;
          const propsExpr = hasProps ? `{ ${props.join(', ')} }` : '';

          commit(
            createFunctionCall(RUNTIME.createComponent, [
              component.tagName,
              hasSpreads
                ? !hasProps && spreads.length === 1
                  ? spreads[0]
                  : createFunctionCall(RUNTIME.mergeProps, [...spreads, propsExpr])
                : propsExpr,
            ]),
          );

          ctx.runtime.add(RUNTIME.createComponent);

          if (hasSpreads && (hasProps || spreads.length > 1)) {
            ctx.runtime.add(RUNTIME.mergeProps);
          }

          props = [];
          spreads = [];
          component = undefined;
        }
      } else if (isStructuralNode(node)) {
        if (isAttributesEnd(node)) {
          const element = elements.at(-1);

          if (merging) {
            let definition!: string | undefined,
              $spread: string[] = [],
              $attrs: Record<string, string> = {},
              $$class: Record<string, string> = {},
              $$style: Record<string, string> = {};

            const commitAttrs = () => {
              if (Object.keys($$class).length) {
                $attrs.$$class = createObjectLiteral($$class);
                $$class = {};
              }

              if (Object.keys($$style).length) {
                $attrs.$$style = createObjectLiteral($$style);
                $$style = {};
              }

              if (Object.keys($attrs).length) {
                $spread.push(createObjectLiteral($attrs));
                $attrs = {};
              }
            };

            for (let i = 0; i < merger.length; i++) {
              const prop = merger[i];
              if (isAttributeNode(prop)) {
                if (prop.namespace === '$prop') {
                  props.push(serializeComponentProp(prop));
                } else if (prop.name === 'element') {
                  definition = prop.value;
                } else {
                  let group = prop.namespace
                    ? prop.namespace === '$class'
                      ? $$class
                      : prop.namespace === '$style' || prop.namespace === '$cssvar'
                      ? $$style
                      : $attrs
                    : $attrs;

                  group[`${prop.namespace === '$cssvar' ? '--' : ''}${prop.name}`] =
                    prop.callId ?? prop.value;
                }
              } else {
                commitAttrs();
                $spread.push(prop.value);
              }
            }

            commitAttrs();

            if (customElement) {
              if (!definition) {
                const ref = customElement.ref;
                const loc = kleur.bold(
                  `${ref.getSourceFile().fileName} ${kleur.cyan(
                    `${ref.getStart()}:${ref.getEnd()}`,
                  )}`,
                );
                throw Error(
                  `[maverick] \`element\` prop was not provided for \`CustomElement\` at ${loc}`,
                );
              }

              if (customElement.children) {
                props.push(serializeComponentChildrenProp(ssr, customElement.children, ctx));
              }

              commit(
                createFunctionCall(RUNTIME.customElement, [
                  definition,
                  props.length > 0 || $spread.length > 0 ? `{ ${props.join(', ')} }` : null,
                  $spread.length > 0 ? `[${$spread.join(', ')}]` : null,
                ]),
              );

              ctx.runtime.add(RUNTIME.customElement);
            } else if ($spread.length) {
              commit(createFunctionCall(RUNTIME.spread, [`[${$spread.join(', ')}]`]));
              ctx.runtime.add(RUNTIME.spread);
            }

            merger = [];
          } else {
            if (classes.length) {
              const baseClassIdx = classes.findIndex((c) => c.name === 'class'),
                baseClass = classes[baseClassIdx];

              if (
                baseClass &&
                classes.length === 1 &&
                !baseClass.dynamic &&
                baseClass.name === 'class'
              ) {
                template += ` class="${escape(trimQuotes(baseClass.value), true)}"`;
              } else {
                if (baseClass) classes.splice(baseClassIdx, 1);

                commit(
                  createFunctionCall(RUNTIME.classes, [
                    baseClass ? baseClass.callId ?? baseClass.value : '""',
                    classes.length > 0 ? createClassesObjectLiteral(classes) : null,
                  ]),
                );
                ctx.runtime.add(RUNTIME.classes);
              }

              classes = [];
            }

            if (styles.length) {
              const baseStyleIdx = styles.findIndex((style) => style.name === 'style'),
                baseStyle = styles[baseStyleIdx];

              if (
                baseStyle &&
                styles.length === 1 &&
                !baseStyle.dynamic &&
                baseStyle.name === 'style'
              ) {
                template += ` style="${escape(
                  trimTrailingSemicolon(trimQuotes(baseStyle.value)),
                  true,
                )}"`;
              } else {
                if (baseStyle) styles.splice(baseStyleIdx, 1);

                commit(
                  createFunctionCall(RUNTIME.styles, [
                    baseStyle ? baseStyle.callId ?? baseStyle.value : '""',
                    styles.length > 0 ? createStylesObjectLiteral(styles) : null,
                  ]),
                );

                ctx.runtime.add(RUNTIME.styles);
              }

              styles = [];
            }
          }

          merging = false;
          if (!customElement && element && !element.isVoid) template += '>';
        } else if (isElementEnd(node)) {
          const element = elements.pop();
          if (customElement) {
            customElement = undefined;
          } else if (element) {
            template += element.isVoid ? ` />` : `</${element.tagName}>`;
          }
        }
      } else if (isFragmentNode(node)) {
        if (node.children) {
          commit(serializeChildren(ssr, node.children, ctx));
        }
      } else if (isElementNode(node)) {
        if (node.isComponent) {
          if (i > 0) marker();
          component = node;
        } else {
          const isCustomElement = node.tagName === 'CustomElement';

          if (i > 0 && !isCustomElement && node.dynamic()) marker();
          merging = isCustomElement || node.spread();

          if (isCustomElement) {
            customElement = node;
          } else {
            template += `<${node.tagName}`;
          }

          elements.push(node);
        }
      } else if (isAttributeNode(node)) {
        if (node.namespace) {
          if (node.namespace === '$class') {
            if (merging) {
              merger.push(node);
            } else {
              classes.push(node);
            }
          } else if (node.namespace === '$style' || node.namespace === '$cssvar') {
            if (merging) {
              merger.push(node);
            } else {
              styles.push(node);
            }
          } else if (customElement && node.namespace === '$prop') {
            merger.push(node);
          }
        } else {
          if (node.name === 'class') {
            if (merging) {
              merger.push(node);
            } else {
              classes.push(node);
            }
          } else if (node.name === 'style') {
            if (merging) {
              merger.push(node);
            } else {
              styles.push(node);
            }
          } else if (merging) {
            merger.push(node);
          } else if (!node.dynamic) {
            template += ` ${node.name}="${escape(trimQuotes(node.value), true)}"`;
          } else {
            commit(createFunctionCall(RUNTIME.attr, [`"${node.name}"`, node.callId ?? node.value]));
            ctx.runtime.add(RUNTIME.attr);
          }
        }
      } else if (isTextNode(node)) {
        template += node.value;
      } else if (isExpressionNode(node)) {
        if (!node.dynamic) {
          template += encode(trimQuotes(node.value));
        } else {
          marker();
          const code = !node.children ? node.value : serializeParentExpression(ssr, node, ctx);
          commit(node.callId ?? (node.observable ? `() => ${code}` : code));
        }
      } else if (isSpreadNode(node)) {
        merger.push(node);
      }
    }

    if (template.length) {
      templates.push(template);
    }

    if (isFirstNodeComponent || isFirstNodeFragment) {
      return parts[0];
    } else if (templates.length) {
      const templateId = ctx.globals.create(
        ID.template,
        `[${templates.map((t) => `"${escapeDoubleQuotes(t)}"`).join(', ')}]`,
      );

      ctx.runtime.add(RUNTIME.ssr);
      return createFunctionCall(RUNTIME.ssr, [templateId, ...parts]);
    }

    return '';
  },
};

function createClassesObjectLiteral(classes: AttributeNode[]) {
  const props = {};

  for (let i = 0; i < classes.length; i++) {
    const attr = classes[i];
    props[attr.name] = attr.callId ?? attr.value;
  }

  return createObjectLiteral(props);
}

function createStylesObjectLiteral(classes: AttributeNode[]) {
  const props = {};

  for (let i = 0; i < classes.length; i++) {
    const attr = classes[i];
    props[`${attr.namespace === '$cssvar' ? '--' : ''}${attr.name}`] = attr.callId ?? attr.value;
  }

  return createObjectLiteral(props);
}
