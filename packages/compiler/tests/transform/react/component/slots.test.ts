import { react } from '../../transform';

test('text', () => {
  expect(react('<Foo>Hello</Foo>')).toMatchInlineSnapshot(`
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

test('single static element in default slot', () => {
  expect(react('<Foo><div /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $_static_node_1
        });
        return $_component_1;
    })();
    "
  `);
});

test('single static element in named slot', () => {
  expect(react('<Foo><div slot="foo" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => $_static_node_1
        });
        return $_component_1;
    })();
    "
  `);
});

test('single dynamic element in default slot', () => {
  expect(react('<Foo><div on:click /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", true);
                    }
                }
                return $$_h("div", {
                    ref: $_ref_1.set
                });
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('single dynamic element in named slot', () => {
  expect(react('<Foo><div on:click slot="foo" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => {
                let $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", true);
                    }
                }
                return $$_h("div", {
                    ref: $_ref_1.set
                });
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple static elements in default slot', () => {
  expect(react('<Foo><div /><span /></Foo>')).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div"), $_static_node_2 = /* @__PURE__ */ $$_h("span");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $$_h(ReactFragment, null, $_static_node_1, $_static_node_2)
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple static elements in named slot', () => {
  expect(react('<Foo><div slot="foo" /><span slot="bar" /></Foo>')).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div"), $_static_node_2 = /* @__PURE__ */ $$_h("span");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => $_static_node_1,
            "bar": () => $_static_node_2
        });
        return $_component_1;
    })();
    "
  `);
});

test('default namespaced slot', () => {
  expect(react('<Foo><Foo.Slot><div /></Foo.Slot></Foo>')).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => $_static_node_1
        });
        return $_component_1;
    })();
    "
  `);
});

test('named namespaced slot', () => {
  expect(react('<Foo><Foo.Slot name="foo"><div /></Foo.Slot></Foo>')).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => $_static_node_1
        });
        return $_component_1;
    })();
    "
  `);
});

test('multiple named namespaced slot', () => {
  expect(
    react(
      '<Foo><Foo.Slot name="foo"><div /></Foo.Slot><Foo.Slot name="bar"><div /></Foo.Slot></Foo>',
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div"), $_static_node_2 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => $_static_node_1,
            "bar": () => $_static_node_2
        });
        return $_component_1;
    })();
    "
  `);
});

test('fragment default slot', () => {
  expect(react(`<Foo><Fragment><div /><div /></Fragment></Foo>`)).toMatchInlineSnapshot(`
    "import { ReactFragment, $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div"), $_static_node_2 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_component_2 = $$_create_component(Fragment, null, null, {
                    "default": () => $$_h(ReactFragment, null, $_static_node_1, $_static_node_2)
                });
                return $_component_2;
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('fragment named slot', () => {
  expect(react(`<Foo><Fragment slot="foo"><div /><div /><div>{a}</div></Fragment></Foo>`))
    .toMatchInlineSnapshot(`
    "import { ReactFragment, $$_h, $$_expression, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div"), $_static_node_2 = /* @__PURE__ */ $$_h("div");
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "foo": () => {
                let $_component_2 = $$_create_component(Fragment, null, null, {
                    "default": () => $$_h(ReactFragment, null, $_static_node_1, $_static_node_2, $$_h("div", null, $$_expression(a)))
                });
                return $_component_2;
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('render function', () => {
  expect(react(`<Foo>{(props) => <div>{props.foo}</div>}</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": (props) => $$_h("div", null, $$_expression(props.foo))
        });
        return $_component_1;
    })();
    "
  `);
});

test('render function with nested component', () => {
  expect(
    react(`
<Foo>
  {({ foo, bar }) => (
    <div>
      {foo}
      <Bar>{(bux) => <span>{bux.a}{bar}</span>}</Bar>
    </div>
  )}
</Foo>`),
  ).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": ({ foo, bar }) => {
                let $_component_2 = $$_create_component(Bar, null, null, {
                    "default": (bux) => $$_h("span", null, $$_expression(bux.a), $$_expression(bar))
                });
                return $$_h("div", null, $$_expression(foo), $_component_2);
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('render function with binary expression', () => {
  expect(react(`<Foo>{(props) => <div>{props.foo + 10}</div>}</Foo>`)).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": (props) => $$_h("div", null, $$_expression(props.foo + 10))
        });
        return $_component_1;
    })();
    "
  `);
});

test('render function with many args and nested components', () => {
  expect(
    react(
      `
<Foo>
  {(a, b, { c }, [d], e, f, g) => {
    return (
      <div>
        {a}{b}{c}{d}
        <Bar>
          {e.a}
          <span>{f.a}{f.b}</span>
          <Bux>{a.a}{g}{g}</Bux>
          <Hux>{(h) => <div>{a + 10}{a}{e.a}{e.b()}{call(h)}{i}</div>}</Hux>
        </Bar>
      </div>
  }}
</Foo>`,
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_expression, ReactFragment, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": (a, b, { c }, [d], e, f, g) => {
                return (() => {
                    let $_component_2 = $$_create_component(Bar, null, null, {
                        "default": () => {
                            let $_component_3 = $$_create_component(Bux, null, null, {
                                "default": () => $$_h(ReactFragment, null, $$_expression(a.a), $$_expression(g), $$_expression(g))
                            }), $_component_4 = $$_create_component(Hux, null, null, {
                                "default": (h) => $$_h("div", null, $$_expression(a + 10), $$_expression(a), $$_expression(e.a), $$_expression(e.b()), $$_expression(call(h)), $$_expression(i))
                            });
                            return $$_h(ReactFragment, null, $$_expression(e.a), $$_h("span", null, $$_expression(f.a), $$_expression(f.b)), $_component_3, $_component_4);
                        }
                    });
                    return $$_h("div", null, $$_expression(a), $$_expression(b), $$_expression(c), $$_expression(d), $_component_2);
                })();
            }
        });
        return $_component_1;
    })();
    "
  `);
});

test('render function with many expressions inside elements', () => {
  expect(
    react(`
function Bar() {
  return <Foo>{(a,b) => <div><span>{a}</span><span>{b}</span><span>Static</span></div>}</Foo>
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("span", null, "Static");
    function Bar() {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": (a, b) => $$_h("div", null, $$_h("span", null, $$_expression(a)), $$_h("span", null, $$_expression(b)), $_static_node_1)
        });
        return $_component_1;
    }
    "
  `);
});

test('render function with dynamic root element and no expression', () => {
  expect(
    react(`
function Bar() {
  return <Foo>{() => <div on:click={onClick}>Text</div>}</Foo>
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_create_component } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Bar() {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": () => {
                let $_ref_1 = $$_ref();
                if ($$_IS_CLIENT) {
                    $$_on_attach($_ref_1, $_attach_1);
                    function $_attach_1(el) {
                        $$_listen(el, "click", onClick);
                    }
                }
                return $$_h("div", {
                    ref: $_ref_1.set
                }, "Text");
            }
        });
        return $_component_1;
    }
    "
  `);
});

test('render function with multiple expressions', () => {
  expect(
    react(`
      <Foo>
        {({ a, b, $c }) => (
          <span>
            {a} - {b} - {$c}
          </span>
        )}
      </Foo>
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    (() => {
        let $_component_1 = $$_create_component(Foo, null, null, {
            "default": ({ a, b, $c }) => $$_h("span", null, $$_expression(a), " - ", $$_expression(b), " - ", $$_expression($c))
        });
        return $_component_1;
    })();
    "
  `);
});
