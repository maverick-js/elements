import { react } from '../../transform';

test('spread', () => {
  expect(react('<Foo {...a}  />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen_callback, $$_host_spread } from "@maverick-js/dom";
    (() => {
        let $_spread_props_1 = a, $_listeners_1 = $$_listen_callback($_spread_props_1), $_component_1 = $$_create_component(Foo, $_spread_props_1, $$_IS_CLIENT ? $_listeners_1 : null, null, host => {
            $$_host_spread(host, $_spread_props_1);
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple', () => {
  expect(react('<Foo {...a} {...b} {...{a: 1, b: 2}} />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_merge_props, $$_listen_callback, $$_host_spread } from "@maverick-js/dom";
    (() => {
        let $_spread_props_1 = $$_merge_props(a, b, { a: 1, b: 2 }), $_listeners_1 = $$_listen_callback($_spread_props_1), $_component_1 = $$_create_component(Foo, $_spread_props_1, $$_IS_CLIENT ? $_listeners_1 : null, null, host => {
            $$_host_spread(host, $_spread_props_1);
        });
        return $_component_1;
    })();
    "
  `);
});

test('with attributes', () => {
  expect(
    react(
      '<Foo {...a} {...b} class="..." $class:foo={isFoo} $style:color={color} $var:foo={fooVar} on:click={onClick} />',
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_merge_props, $$_listen_callback, $$_host_spread } from "@maverick-js/dom";
    (() => {
        let $_spread_props_1 = $$_merge_props(a, b), $_listeners_1 = $$_listen_callback($_spread_props_1), $_component_1 = $$_create_component(Foo, $_spread_props_1, $$_IS_CLIENT ? $_listeners_1 : null, null, host => {
            $$_host_spread(host, $$_merge_props($_spread_props_1, {
                class: "...",
                "$class:foo": isFoo,
                "$var:foo": fooVar,
                "on:click": onClick
            }));
        });
        return $_component_1;
    })();
    "
  `);
});

test('with props', () => {
  expect(react('<Foo {...a} {...b} foo={10} bar={20}  />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_merge_props, $$_listen_callback, $$_host_spread } from "@maverick-js/dom";
    (() => {
        let $_spread_props_1 = $$_merge_props(a, b, {
            "foo": 10,
            "bar": 20
        }), $_listeners_1 = $$_listen_callback($_spread_props_1), $_component_1 = $$_create_component(Foo, $_spread_props_1, $$_IS_CLIENT ? $_listeners_1 : null, null, host => {
            $$_host_spread(host, $_spread_props_1);
        });
        return $_component_1;
    })();
    "
  `);
});

test('inside expression', () => {
  expect(react('<div>{a() ? <Foo {...a} {...b} /> : null}</div>')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component, $$_expression, $$_h } from "@maverick-js/react";
    import { $$_merge_props, $$_listen_callback, $$_host_spread } from "@maverick-js/dom";
    $$_h("div", null, $$_expression(a() ? (() => {
        let $_spread_props_1 = $$_merge_props(a, b), $_listeners_1 = $$_listen_callback($_spread_props_1), $_component_1 = $$_create_component(Foo, $_spread_props_1, $$_IS_CLIENT ? $_listeners_1 : null, null, host => {
            $$_host_spread(host, $_spread_props_1);
        });
        return $_component_1;
    })() : null));
    "
  `);
});
