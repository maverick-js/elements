import { react } from '../../transform';

test('static', () => {
  expect(
    react(`
function Foo() {
  return <svg style:color="blue"/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        style: {
            color: "blue"
        }
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
  return <svg style:color="blue"/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        style: {
            color: "blue"
        }
    });
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('dynamic base', () => {
  expect(
    react(`
function Foo() {
  return <svg style={styles} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style(styles, {})
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_attr(el, "style", styles);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('signal base', () => {
  expect(
    react(`
function Foo() {
  return <svg $style={styles} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style($$_unwrap(styles), {})
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_attr(el, "style", styles);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg style:color={color} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "color": color
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "color", color);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('multiple dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg style:color={color} style:backgroundColor={bgColor} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "color": color,
                "backgroundColor": bgColor
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "color", color);
            $$_style(el, "backgroundColor", bgColor);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('signal', () => {
  expect(
    react(`
function Foo() {
  return <svg $style:color={color}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "color": color
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "color", color);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('multiple signals', () => {
  expect(
    react(`
function Foo() {
  return <svg $style:color={color} $style:backgroundColor={bgColor}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "color": color,
                "backgroundColor": bgColor
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "color", color);
            $$_style(el, "backgroundColor", bgColor);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('with dynamic base', () => {
  expect(react(`<svg style={styles} $style:foo={foo} />`)).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr, $$_style } from "@maverick-js/dom";
    (() => {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style(styles, {
                "foo": foo
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_attr(el, "style", styles);
            $$_style(el, "foo", foo);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    })();
    "
  `);
});

test('with signal base', () => {
  expect(react(`<svg $style={$styles} $style:foo={foo} />`)).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style_tokens, $$_style } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    (() => {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style($$_unwrap($styles), {
                "foo": foo
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style_tokens(el, $styles);
            $$_style(el, "foo", foo);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("svg", {
                ...$_ssr_attrs_1,
                suppressHydrationWarning: true,
                ref: $_ref_1
            });
        }
        return $_node_1;
    })();
    "
  `);
});
