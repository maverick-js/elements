import { react } from '../../transform';

test('spread', () => {
  expect(
    react(`
function Foo() {
  return <div {...a}  />
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_ssr_spread, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = a, $_ssr_props_1 = $$_IS_SERVER ? $$_ssr_spread($_spread_props_1) : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_spread(el, $_spread_props_1);
            }
        }
        return $$_h("div", {
            [$$_suppress_hydration_warning]: true,
            ...$_ssr_props_1,
            ref: $_ref_1.set
        });
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
    "import { $$_ssr_spread, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = $$_merge_props(a, b, { a: 1, b: 2 }), $_ssr_props_1 = $$_IS_SERVER ? $$_ssr_spread($_spread_props_1) : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_spread(el, $_spread_props_1);
            }
        }
        return $$_h("div", {
            [$$_suppress_hydration_warning]: true,
            ...$_ssr_props_1,
            ref: $_ref_1.set
        });
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
    "import { $$_ssr_spread, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_spread_props_1 = $$_merge_props(a, b, {
            "$class:foo": isFoo,
            "$style:color": color,
            "$var:foo": fooVar,
            "$prop:foo": fooProp,
            "on:click": onClick,
            ref: onRef
        }), $_ssr_props_1 = $$_IS_SERVER ? $$_ssr_spread($_spread_props_1) : null, $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_spread(el, $_spread_props_1);
            }
        }
        return $$_h("div", {
            [$$_suppress_hydration_warning]: true,
            ...$_ssr_props_1,
            ref: $_ref_1.set
        });
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
    "import { $$_ssr_spread, $$_IS_SERVER, $$_suppress_hydration_warning, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_merge_props, $$_spread } from "@maverick-js/dom";
    function Foo() {
        let $_component_1 = $$_create_component(Bar, null, null, {
            "default": (props) => {
                let $_spread_props_1 = $$_merge_props(a, b), $_ssr_props_1 = $$_IS_SERVER ? $$_ssr_spread($_spread_props_1) : null, $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_spread(el, $_spread_props_1);
                    }
                }
                return $$_h("div", {
                    [$$_suppress_hydration_warning]: true,
                    ...$_ssr_props_1,
                    ref: $_ref_1.set
                }, $$_expression(props.foo));
            }
        });
        return $_component_1;
    }
    "
  `);
});
