import { react } from '../../transform';

test('none', () => {
  expect(
    react(`
function Foo() {
  return <svg />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg");
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('static', () => {
  expect(
    react(`
function Foo() {
  return <svg width={1920} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        width: 1920
    });
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('multiple static', () => {
  expect(
    react(`
function Foo() {
  return <svg width={1920} height={1080} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        width: 1920,
        height: 1080
    });
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg width={calcWidth} autocomplete />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            "width": calcWidth
        } : null, $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_attr(el, "width", calcWidth);
        }
        return $$_h("svg", {
            autoComplete: true,
            ...$_ssr_attrs_1,
            suppressHydrationWarning: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('multiple dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg width={calcWidth} height={calcHeight} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            "width": calcWidth,
            "height": calcHeight
        } : null, $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_attr(el, "width", calcWidth);
            $$_attr(el, "height", calcHeight);
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            suppressHydrationWarning: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('signal', () => {
  expect(
    react(`
function Foo() {
  return <svg $width={width} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            "width": $$_unwrap(width)
        } : null, $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_attr(el, "width", width);
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            suppressHydrationWarning: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('multiple signals', () => {
  expect(
    react(`
function Foo() {
  return <svg $width={width} $height={height} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            "width": $$_unwrap(width),
            "height": $$_unwrap(height)
        } : null, $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_attr(el, "width", width);
            $$_attr(el, "height", height);
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            suppressHydrationWarning: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});
