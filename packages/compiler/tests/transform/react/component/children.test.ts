import { react } from '../../transform';

test('none', () => {
  expect(react(`<Foo />`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo);
        return $_component_1;
    })();
    "
  `);
});

test('text child', () => {
  expect(react(`<Foo>Hello</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => "Hello"
        });
        return $_component_1;
    })();
    "
  `);
});

test('one static child element', () => {
  expect(react(`<Foo><span /></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("span");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $_static_node_1
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple static child elements', () => {
  expect(react(`<Foo><span></span><span></span></Foo>`)).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("span"), $_static_node_2 = /* @__PURE__ */ $$_h("span");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h(ReactFragment, null, $_static_node_1, $_static_node_2)
        });
        return $_component_1;
    })();
    "
  `);
});

test('one dynamic child element', () => {
  expect(react(`<Foo><span on:click={onClick} /></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", onClick);
                    }
                }
                return $$_h("span", {
                    ref: $_ref_1.set
                });
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple dynamic child elements', () => {
  expect(react(`<Foo><span on:click={onA} /><span on:click={onB} /></Foo>`)).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_ref_1 = $$_ref(), $_ref_2 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", onA);
                    }
                }
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_2, $_attach_2);
                    function $_attach_2(el) {
                        $$_listen(el, "click", onB);
                    }
                }
                return $$_h(ReactFragment, null, $$_h("span", {
                    ref: $_ref_1.set
                }), $$_h("span", {
                    ref: $_ref_2.set
                }));
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('one static child expression', () => {
  expect(react(`<Foo>{"foo"}</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => "foo"
        });
        return $_component_1;
    })();
    "
  `);
});

test('one dynamic child expression', () => {
  expect(react(`<Foo>{a()}</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_expression, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_expression(a())
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple dynamic child expressions', () => {
  expect(
    react(
      `
function Bar() {
  return <Foo>{a() ? <div><Bar on:click={onA} /></div> : null}{b() ? <span on:click={onB} /> : null}</Foo>
}
      `,
    ),
  ).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_IS_CLIENT, $$_create_component, $$_h, $$_expression, $$_ref, $$_on_attach } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Bar() {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h(ReactFragment, null, $$_expression(a() ? (() => {
                let $_component_2 = $$_create_component(Bar, null, $$_IS_CLIENT ? instance => {
                    $$_listen(instance, "click", onA);
                } : null);
                return $$_h("div", null, $_component_2);
            })() : null), $$_expression(b() ? (() => {
                let $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", onB);
                    }
                }
                return $$_h("span", {
                    ref: $_ref_1.set
                });
            })() : null))
        });
        return $_component_1;
    }
    "
  `);
});

test('child component', () => {
  expect(react(`<Foo><Bar on:foo={onFoo} /></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_component_2 = $$_create_component(Bar, null, $$_IS_CLIENT ? instance => {
                    $$_listen(instance, "foo", onFoo);
                } : null);
                return $_component_2;
            }
        });
        return $_component_1;
    })();
    "
  `);
});