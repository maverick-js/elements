import { react } from '../../transform';

test('on', () => {
  expect(react('<Foo on:click={onClick} />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, $$_IS_CLIENT ? instance => {
            $$_listen(instance, "click", onClick);
        } : null);
        return $_component_1;
    })();
    "
  `);
});

test('capture', () => {
  expect(react('<Foo on_capture:click={onClick} />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, $$_IS_CLIENT ? instance => {
            $$_listen(instance, "click", onClick, true);
        } : null);
        return $_component_1;
    })();
    "
  `);
});

test('multiple', () => {
  expect(react('<Foo on:down={onDown} on:up={onUp}  />')).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, $$_IS_CLIENT ? instance => {
            $$_listen(instance, "down", onDown);
            $$_listen(instance, "up", onUp);
        } : null);
        return $_component_1;
    })();
    "
  `);
});
