import { react } from '../../transform';

test('spread', () => {
  expect(
    react(`
function Foo() {
  return <div {...a}  />
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_spread, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = a, $_ssr_props_1 = $$_IS_SERVER ? $$_spread($_spread_props_1) : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_spread(el, $_spread_props_1);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ...$_ssr_props_1,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('multiple', () => {
  expect(
    react(`
function Foo() {
  return <div {...a} {...b} {...{a: 1, b: 2}} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_spread, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = $$_merge_props(a, b, { a: 1, b: 2 }), $_ssr_props_1 = $$_IS_SERVER ? $$_spread($_spread_props_1) : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_spread(el, $_spread_props_1);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ...$_ssr_props_1,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('with attributes', () => {
  expect(
    react(`
function Foo() {
  return <div {...a} {...b} $prop:foo={fooProp} $class:foo={isFoo} $style:color={color} $var:foo={fooVar} on:click={onClick} ref={onRef} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_spread, $$_IS_SERVER, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = $$_merge_props(a, b, {
            "$class:foo": isFoo,
            "$style:color": color,
            "$var:foo": fooVar,
            "$prop:foo": fooProp,
            "on:click": onClick,
            ref: onRef
        }), $_ssr_props_1 = $$_IS_SERVER ? $$_spread($_spread_props_1) : null, $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_spread(el, $_spread_props_1);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ...$_ssr_props_1,
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('in render function', () => {
  expect(
    react(`
function Foo() {
  return <Bar>{(props) => <div {...a} {...b}>{props.foo}</div>}</Bar>
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_memo, $$_spread, $$_IS_SERVER, $$_attach_callback, $$_IS_CLIENT, $$_expression, $$_h, $$_component_scope, $$_create_component } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_component_1 = $$_create_component(Bar, null, null, {
            "default": (props) => $$_h($_render_1.bind($$_component_scope, props))
        });
        function $_attach_1(el) {
            $$_spread(el, $_spread_props_1);
        }
        function $_render_1(props) {
            let $_spread_props_1 = $$_memo(this, () => $$_merge_props(a, b), [a, b]), $_ssr_props_1 = $$_IS_SERVER ? $$_memo(this, () => $$_spread($_spread_props_1), [$_spread_props_1]) : null, $_ref_1 = $$_IS_CLIENT ? $$_attach_callback(this, $_attach_1) : null, $_node_1 = $$_expression(props.foo);
            return $$_h("div", {
                ...$_ssr_props_1,
                ref: $_ref_1
            }, $_node_1);
        }
        return $_component_1;
    }
    "
  `);
});
