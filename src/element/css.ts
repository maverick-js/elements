import type { ElementCSSVarRecord } from './types';

export function defineCSSVar<Value>(value?: Value) {
  return value;
}

export function defineCSSVars<Definition extends ElementCSSVarRecord>(): Definition {
  // type macro which is compiled away.
  return null as any;
}

/**
 * The code below this comment was adapted from Lit: https://github.dev/lit/lit
 *
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

const CSS = Symbol(),
  sheetCache = new WeakMap<TemplateStringsArray, CSSStyleSheet>(),
  supportsAdoptedStyleSheets =
    !__SERVER__ &&
    ShadowRoot &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;

export type CSS = {
  readonly [CSS]?: true;
  readonly text: string;
  readonly sheet?: CSSStyleSheet;
  toString(): string;
};

export function injectCSS(value: unknown) {
  return createCSS(value + '');
}

/**
 * A template literal tag which can be used with Maverick's `defineElement` function to create
 * element styles. For security reasons, only literal string values and number may be used in
 * embedded expressions. Use `unsafeCSS` to incorporate non-literal values inside CSS expressions.
 */
export function css(strings: TemplateStringsArray, ...values: (CSS | number)[]): CSS {
  let css = strings[0] ?? '';

  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (value?.[CSS]) {
      css += (value as CSS).text;
    } else if (typeof value === 'number') {
      css += value;
    } else if (__DEV__) {
      throw new Error(
        `[maverick] value passed to \`css\` function must be a \`css\` function result: ` +
          `${value}. Use \`unsafeCSS\` to pass non-literal values, but take care ` +
          `to ensure page security.`,
      );
    }

    css += strings[i + 1];
  }

  return createCSS(css, strings);
}

function createCSS(css: string, strings?: TemplateStringsArray): CSS {
  let styleSheet: CSSStyleSheet | undefined;
  return {
    [CSS]: true,
    get text() {
      return css;
    },
    get sheet() {
      if (styleSheet) {
        return styleSheet;
      } else if (strings && sheetCache.has(strings)) {
        return sheetCache.get(strings);
      } else if (supportsAdoptedStyleSheets) {
        (styleSheet = new CSSStyleSheet()).replaceSync(css);
        if (strings) sheetCache.set(strings, styleSheet);
        return styleSheet;
      }

      return; // make TS happy -_-
    },
    toString() {
      return css;
    },
  };
}

export function adoptCSS(root: Document | ShadowRoot, css: CSS[]) {
  if (supportsAdoptedStyleSheets) {
    root.adoptedStyleSheets = css.map((css) => css.sheet!);
  } else {
    const style = document.createElement('style');
    style.textContent = css.map((css) => css.text).join('');
    root.appendChild(style);
  }
}
