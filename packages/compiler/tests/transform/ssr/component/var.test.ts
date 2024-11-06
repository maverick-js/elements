import { ssr } from '../../transform';

test('static', () => {
  expect(ssr(`<Foo var:foo={1}/>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": 1
            }
        })]);
    "
  `);
});

test('multiple static', () => {
  expect(ssr(`<Foo var:foo={1} var:bar={2}/>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": 1,
                "--bar": 2
            }
        })]);
    "
  `);
});

test('dynamic', () => {
  expect(ssr(`<Foo var:foo={getFoo()} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": getFoo()
            }
        })]);
    "
  `);
});

test('multiple dynamic', () => {
  expect(ssr(`<Foo var:foo={getFoo()} var:bar={getBar()}/>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": getFoo(),
                "--bar": getBar()
            }
        })]);
    "
  `);
});

test('signal', () => {
  expect(ssr(`<Foo $var:foo={foo} />`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": foo
            }
        })]);
    "
  `);
});

test('multiple signals', () => {
  expect(ssr(`<Foo $var:foo={foo} $var:bar={bar}/>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, null, {
            $var: {
                "--foo": foo,
                "--bar": bar
            }
        })]);
    "
  `);
});
