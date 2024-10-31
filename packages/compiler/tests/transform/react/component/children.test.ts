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
    "import { $$_attach_callback, $$_IS_CLIENT, $$_h, $$_component_scope, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h($_render_1.bind($$_component_scope))
        });
        function $_attach_1(el) {
            $$_listen(el, "click", onClick);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback(this, $_attach_1) : null;
            return $$_h("span", {
                ref: $_ref_1
            });
        }
        return $_component_1;
    })();
    "
  `);
});

test('multiple dynamic child elements', () => {
  expect(react(`<Foo><span on:click={onA} /><span on:click={onB} /></Foo>`)).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h, $$_component_scope, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_scope_1 = $$_get_scope(), $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h($_render_1.bind($$_component_scope))
        });
        function $_attach_1(el) {
            $$_listen(el, "click", onA);
        }
        function $_attach_2(el) {
            $$_listen(el, "click", onB);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null, $_ref_2 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_2) : null;
            return $$_h(ReactFragment, null, $$_h("span", {
                ref: $_ref_1
            }), $$_h("span", {
                ref: $_ref_2
            }));
        }
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
    "import { $$_computed, $$_expression, $$_component_scope, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_computed_1 = $$_computed(a), $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h($_render_1.bind($$_component_scope))
        });
        function $_render_1() {
            let $_expression_1 = $$_expression($_computed_1);
            return $_expression_1;
        }
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
    "import { ReactFragment, $$_IS_CLIENT, $$_create_component, $$_get_scope, $$_memo, $$_h, $$_computed, $$_expression, $$_attach_callback, $$_component_scope } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Bar() {
        let $_scope_1 = $$_get_scope(), $_component_factory_1 = () => $$_create_component(Bar, null, $$_IS_CLIENT && (instance => {
            $$_listen(instance, "click", onA);
        })), $_node_1 = $$_h($_render_1), $_computed_1 = $$_computed(() => a() ? $_node_1 : null), $_node_2 = $$_h($_render_2), $_computed_2 = $$_computed(() => b() ? $_node_2 : null), $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h($_render_3.bind($$_component_scope))
        });
        function $_render_1() {
            let $_component_2 = $$_memo($_scope_1, $_component_factory_1);
            return $$_h("div", null, $_component_2);
        }
        function $_attach_1(el) {
            $$_listen(el, "click", onB);
        }
        function $_render_2() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("span", {
                ref: $_ref_1
            });
        }
        function $_render_3() {
            let $_expression_1 = $$_expression($_computed_1), $_expression_2 = $$_expression($_computed_2);
            return $$_h(ReactFragment, null, $_expression_1, $_expression_2);
        }
        return $_component_1;
    }
    "
  `);
});

test('child component', () => {
  expect(react(`<Foo><Bar on:foo={onFoo} /></Foo>`)).toMatchInlineSnapshot(`
    "import { $$_IS_CLIENT, $$_create_component, $$_memo, $$_component_scope, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_factory_1 = () => $$_create_component(Bar, null, $$_IS_CLIENT && (instance => {
            $$_listen(instance, "foo", onFoo);
        })), $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h($_render_1.bind($$_component_scope))
        });
        function $_render_1() {
            let $_component_2 = $$_memo(this, $_component_factory_1);
            return $_component_2;
        }
        return $_component_1;
    })();
    "
  `);
});
