import { ssr } from '../../transform';

test('on', () => {
  expect(ssr('<Foo on:click={onClick} />')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo)]);
    "
  `);
});

test('capture', () => {
  expect(ssr('<Foo on_capture:click={onClick} />')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo)]);
    "
  `);
});
