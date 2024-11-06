import { ssr } from '../../transform';

test('text', () => {
  expect(ssr('<Foo>Hello</Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => "Hello"
        })]);
    "
  `);
});

test('single static element in default slot', () => {
  expect(ssr('<Foo><div /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => "<div></div>"
        })]);
    "
  `);
});

test('single static element in named slot', () => {
  expect(ssr('<Foo><div slot="foo" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => "<div></div>"
        })]);
    "
  `);
});

test('single dynamic element in default slot', () => {
  expect(ssr('<Foo><div on:click /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => "<!$><div></div>"
        })]);
    "
  `);
});

test('single dynamic element in named slot', () => {
  expect(ssr('<Foo><div on:click slot="foo" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => "<!$><div></div>"
        })]);
    "
  `);
});

test('multiple static elements in default slot', () => {
  expect(ssr('<Foo><div /><span /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => "<div></div><span></span>"
        })]);
    "
  `);
});

test('multiple static elements in named slot', () => {
  expect(ssr('<Foo><div slot="foo" /><span slot="bar" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => "<div></div>",
            "bar": () => "<span></span>"
        })]);
    "
  `);
});

test('default namespaced slot', () => {
  expect(ssr('<Foo><Foo.Slot><div /></Foo.Slot></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => "<div></div>"
        })]);
    "
  `);
});

test('named namespaced slot', () => {
  expect(ssr('<Foo><Foo.Slot name="foo"><div /></Foo.Slot></Foo>')).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => "<div></div>"
        })]);
    "
  `);
});

test('multiple named namespaced slot', () => {
  expect(
    ssr(
      '<Foo><Foo.Slot name="foo"><div /></Foo.Slot><Foo.Slot name="bar"><div /></Foo.Slot></Foo>',
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => "<div></div>",
            "bar": () => "<div></div>"
        })]);
    "
  `);
});

test('fragment default slot', () => {
  expect(ssr(`<Foo><Fragment><div /><Bar /><div /></Fragment></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""], $$_template_2 = [""], $$_template_3 = ["<div></div>", "<div></div>"];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": () => $$_ssr($$_template_2, [$$_create_component(Fragment, null, {
                    "default": () => $$_ssr($$_template_3, [$$_create_component(Bar)])
                })])
        })]);
    "
  `);
});

test('fragment named slot', () => {
  expect(ssr(`<Foo><Fragment slot="foo"><div /><Bar/><div /></Fragment></Foo>`))
    .toMatchInlineSnapshot(`
      "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
      let $$_template_1 = [""], $$_template_2 = [""], $$_template_3 = ["<div></div>", "<div></div>"];
      $$_ssr($$_template_1, [$$_create_component(Foo, null, {
              "foo": () => $$_ssr($$_template_2, [$$_create_component(Fragment, null, {
                      "default": () => $$_ssr($$_template_3, [$$_create_component(Bar)])
                  })])
          })]);
      "
    `);
});

test('fragment with value then element', () => {
  expect(ssr(`<Foo><Fragment slot="foo"><Bar /><div /></Fragment></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""], $$_template_2 = [""], $$_template_3 = ["", "<div></div>"];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "foo": () => $$_ssr($$_template_2, [$$_create_component(Fragment, null, {
                    "default": () => $$_ssr($$_template_3, [$$_create_component(Bar)])
                })])
        })]);
    "
  `);
});

test('render function', () => {
  expect(ssr(`<Foo>{(props) => <div>{props.foo}</div>}</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_escape, $$_ssr, $$_create_component } from "@maverick-js/ssr";
    let $$_template_1 = [""], $$_template_2 = ["<div>", "</div>"];
    $$_ssr($$_template_1, [$$_create_component(Foo, null, {
            "default": (props) => $$_ssr($$_template_2, [$$_escape(props.foo)])
        })]);
    "
  `);
});

test('element and child components ', () => {
  expect(
    ssr(`
<Host>
  <div>Foo Content</div>
  <Bar />
  <Hux />
</Host>
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""], $$_template_2 = ["<div>Foo Content</div>", ""];
    $$_ssr($$_template_1, [$$_create_component(Host, null, {
            "default": () => $$_ssr($$_template_2, [$$_create_component(Bar), $$_create_component(Hux)])
        })]);
    "
  `);
});
