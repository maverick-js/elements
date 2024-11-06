import { react } from '../../transform';

test('static', () => {
  expect(
    react(`
function Foo() {
  return <svg var:foo={1}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        style: {
            "--foo": 1
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
  return <svg var:foo={1} var:bar={2}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("svg", {
        style: {
            "--foo": 1,
            "--bar": 2
        }
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
  return <svg var:foo={getFoo()} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": getFoo()
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "--foo", getFoo());
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
  return <svg var:foo={getFoo()} var:bar={getBar()} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": getFoo(),
                "--bar": getBar()
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "--foo", getFoo());
                $$_style(el, "--bar", getBar());
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
  return <svg $var:foo={foo} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": foo
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "--foo", foo);
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
  return <svg $var:foo={foo} $var:bar={bar}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": foo,
                "--bar": bar
            })
        } : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_style(el, "--foo", foo);
                $$_style(el, "--bar", bar);
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
