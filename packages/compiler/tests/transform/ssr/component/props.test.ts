import { ssr } from '../../transform';

test('single prop', () => {
  expect(ssr(`<Foo foo={10} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, {
            "foo": 10
        })]);
    "
  `);
});

test('multiple props', () => {
  expect(ssr(`<Foo foo={10} bar={getBar} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, {
            "foo": 10,
            "bar": getBar
        })]);
    "
  `);
});
