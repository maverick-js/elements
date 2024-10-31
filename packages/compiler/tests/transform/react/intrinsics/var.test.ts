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
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": getFoo()
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "--foo", getFoo());
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
  return <svg var:foo={getFoo()} var:bar={getBar()} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": getFoo(),
                "--bar": getBar()
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "--foo", getFoo());
            $$_style(el, "--bar", getBar());
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
  return <svg $var:foo={foo} />
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": foo
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "--foo", foo);
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
  return <svg $var:foo={foo} $var:bar={bar}/>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_style, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_style } from "@maverick-js/dom";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            style: $$_style("", {
                "--foo": foo,
                "--bar": bar
            })
        } : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_style(el, "--foo", foo);
            $$_style(el, "--bar", bar);
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
