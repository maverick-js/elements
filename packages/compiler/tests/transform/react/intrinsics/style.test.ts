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
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style(styles, {})
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_attr(el, "style", styles);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
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
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style($$_unwrap(styles), {})
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_attr(el, "style", styles);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
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
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style("", {
                "color": color
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "color", color);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
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
  return <svg style:color={color} style:backgroundColor={bgColor} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style("", {
                "color": color,
                "backgroundColor": bgColor
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "color", color);
                $$_style(el, "backgroundColor", bgColor);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
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
  return <svg $style:color={color}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style("", {
                "color": color
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "color", color);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
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
  return <svg $style:color={color} $style:backgroundColor={bgColor}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style("", {
                "color": color,
                "backgroundColor": bgColor
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "color", color);
                $$_style(el, "backgroundColor", bgColor);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('with dynamic base', () => {
  expect(react(`<svg style={styles} $style:foo={foo} />`)).toMatchInlineSnapshot(`
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr, $$_style } from "@maverick-js/dom";
    (() => {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style(styles, {
                "foo": foo
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_attr(el, "style", styles);
                $$_style(el, "foo", foo);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
    })();
    "
  `);
});

test('with signal base', () => {
  expect(react(`<svg $style={$styles} $style:foo={foo} />`)).toMatchInlineSnapshot(`
    "import { $$_ssr_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style_tokens, $$_style } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    (() => {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_ssr_style($$_unwrap($styles), {
                "foo": foo
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style_tokens(el, $styles);
                $$_style(el, "foo", foo);
            }
        }
        return $$_h("svg", {
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
    })();
    "
  `);
});
