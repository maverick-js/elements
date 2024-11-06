import { ssr } from '../../transform';

test('spread', () => {
  expect(
    ssr(`
let a = {};
<Foo {...a}  />
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_merge_host_attrs, $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    let a = {};
    (() => {
        let $_spread_1 = a;
        return $$_ssr($$_template_1, [$$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1))]);
    })();
    "
  `);
});

test('multiple', () => {
  expect(ssr('<Foo {...a} {...b} {...{a: 1, b: 2}} />')).toMatchInlineSnapshot(`
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    (() => {
        let $_spread_1 = $$_merge_props(a, b, { a: 1, b: 2 });
        return $$_ssr($$_template_1, [$$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1))]);
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
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    (() => {
        let $_spread_1 = $$_merge_props(a, b);
        return $$_ssr($$_template_1, [$$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1, {
                class: "...",
                "$class:foo": isFoo,
                "$var:foo": fooVar
            }))]);
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
    "import { $$_merge_props, $$_merge_host_attrs, $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    function Bar() {
        let $_spread_1 = $$_merge_props(a, b);
        return $$_ssr($$_template_1, [$$_create_component(Foo, $$_merge_props($_spread_1, {
                "foo": 10,
                "bar": 20
            }), null, $$_merge_host_attrs($_spread_1))]);
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
    "import { $$_merge_host_attrs, $$_create_component, $$_ssr, $$_merge_props, $$_merge_attrs } from "@maverick-js/ssr";
    let $$_template_1 = [""], $$_template_2 = [""], $$_template_3 = ["<!$><div", "></div>"], $$_template_4 = [""];
    function Foo() {
        class Foo {
            render() {
                const a = {};
                let $_spread_3 = a;
                return $$_ssr($$_template_1, [$$_create_component(Host, $_spread_3, null, $$_merge_host_attrs($_spread_3))]);
            }
        }
        let $_spread_1 = $$_merge_props(a, b);
        $$_ssr($$_template_2, [$$_create_component(Foo, $_spread_1, null, $$_merge_host_attrs($_spread_1))]);
        $$_ssr($$_template_3, [$$_merge_attrs(b, c)]);
        const c = {};
        let $_spread_2 = $$_merge_props(c, d);
        $$_ssr($$_template_4, [$$_create_component(Bar, $_spread_2, null, $$_merge_host_attrs($_spread_2))]);
    }
    "
  `);
});
