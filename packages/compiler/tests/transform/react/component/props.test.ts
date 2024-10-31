import { react } from '../../transform';

test('single prop', () => {
  expect(react(`<Foo foo={10} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, {
            "foo": 10
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple props', () => {
  expect(react(`<Foo foo={10} bar={getBar} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, {
            "foo": 10,
            "bar": getBar
        });
        return $_component_1;
    })();
    "
  `);
});
