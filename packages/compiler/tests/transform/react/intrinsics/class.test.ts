import { react } from '../../transform';

test('static', () => {
  expect(
    react(`
function Foo() {
  return <svg class:foo={true} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        className: "foo"
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
  return <svg class:foo={true} class:bar={false} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        className: "foo"
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
  return <svg class={classList} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class(classList)
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_attr(el, "class", classList);
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
  return <svg $class={classList} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_attr } from "@maverick-js/dom";
    import { $$_unwrap, $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class($$_unwrap(classList))
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_attr(el, "class", classList);
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
  return <svg class:foo={isFoo()} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    import { $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class("", {
                "foo": isFoo()
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_class(el, "foo", isFoo());
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
  return <svg class:foo={isFoo()} class:bar={isBar()} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    import { $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class("", {
                "foo": isFoo(),
                "bar": isBar()
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_class(el, "foo", isFoo());
                $$_class(el, "bar", isBar());
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
  return <svg $class:foo={isFoo} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    import { $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class("", {
                "foo": isFoo
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_class(el, "foo", isFoo);
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
  return <svg class="foo" $class:foo={isFoo} $class:bar={isBar} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    import { $$_class } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            className: $$_class("foo", {
                "foo": isFoo,
                "bar": isBar
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_class(el, "foo", isFoo);
                $$_class(el, "bar", isBar);
            }
        }
        return $$_h("svg", {
            className: "foo",
            ...$_ssr_attrs_1,
            [$$_suppress_hydration_warning]: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});
