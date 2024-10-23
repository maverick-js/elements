import { ssr } from '../../transform';

test('spread', () => {
  expect(
    ssr(`
let a = {};
<Foo {...a}  />
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_merge_host_attrs, $$_create_component } from "@maverick-js/ssr";
    let a = {};
    (() => {
        let $_spread_1 = a;
        return $$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1));
    })();
    "
  `);
});

test('multiple', () => {
  expect(ssr('<Foo {...a} {...b} {...{a: 1, b: 2}} />')).toMatchInlineSnapshot(`
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component } from "@maverick-js/ssr";
    (() => {
        let $_spread_1 = $$_merge_props(a, b, { a: 1, b: 2 });
        return $$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1));
    })();
    "
  `);
});

test('with attributes', () => {
  expect(
    ssr(
      '<Foo {...a} {...b} class="..." $class:foo={isFoo} $style:color={color} $var:foo={fooVar} on:click={onClick} />',
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component } from "@maverick-js/ssr";
    (() => {
        let $_spread_1 = $$_merge_props(a, b);
        return $$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1, {
            class: "...",
            "$class:foo": isFoo,
            "$var:foo": fooVar
        }));
    })();
    "
  `);
});

test('with props', () => {
  expect(
    ssr(`
function Bar() {
  return <Foo {...a} {...b} foo={10} bar={20}  />
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component } from "@maverick-js/ssr";
    function Bar() {
        let $_spread_1 = $$_merge_props(a, b);
        return $$_create_component(Foo, $$_merge_props($_spread_1, {
            "foo": 10,
            "bar": 20
        }), null, $$_merge_host_attrs($_spread_1));
    }
    "
  `);
});

test('multiple spread nodes', () => {
  expect(
    ssr(`
function Foo() {
  class Foo {
    render() {
      const a = {};
      return <Host {...a} />
    }
  }

  <Foo {...a} {...b} />;
  <div {...b} {...c} />;
  const c = {};
  <Bar {...c} {...d} />;
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_merge_host_attrs, $$_create_component, $$_merge_props, $$_merge_attrs, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = ["<!$><div", "></div>"];
    function Foo() {
        class Foo {
            render() {
                const a = {};
                let $_spread_3 = a;
                return $$_create_component(Host, $_spread_3, null, $$_merge_host_attrs($_spread_3));
            }
        }
        let $_spread_1 = $$_merge_props(a, b);
        $$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1));
        $$_ssr($$_template_1, [$$_merge_attrs(b, c)]);
        const c = {};
        let $_spread_2 = $$_merge_props(c, d);
        $$_create_component(Bar, $_spread_2, null, $$_merge_host_attrs($_spread_2));
    }
    "
  `);
});
