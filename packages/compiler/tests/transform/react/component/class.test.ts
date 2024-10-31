import { react } from '../../transform';

test('append', () => {
  expect(react(`<Foo class="foo" />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_append_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_append_class(host, "foo");
        });
        return $_component_1;
    })();
    "
  `);
});

test('static', () => {
  expect(react(`<Foo class:foo />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", true);
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple static', () => {
  expect(react(`<Foo class:foo={true} class:bar={false} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", true);
            $$_class(host, "bar", false);
        });
        return $_component_1;
    })();
    "
  `);
});

test('dynamic', () => {
  expect(react(`<Foo class:foo={isFoo()} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", isFoo());
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple dynamic', () => {
  expect(react(`<Foo class:foo={isFoo()} class:bar={isBar()} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", isFoo());
            $$_class(host, "bar", isBar());
        });
        return $_component_1;
    })();
    "
  `);
});

test('signal', () => {
  expect(react(`<Foo $class:foo={isFoo} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", isFoo);
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple signals', () => {
  expect(react(`<Foo $class:foo={isFoo} $class:bar={isBar} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    import { $$_class } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, null, host => {
            $$_class(host, "foo", isFoo);
            $$_class(host, "bar", isBar);
        });
        return $_component_1;
    })();
    "
  `);
});
