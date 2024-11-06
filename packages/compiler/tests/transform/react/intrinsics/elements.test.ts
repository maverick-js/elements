// fragment component
import { react } from '../../transform';

test('no children', () => {
  expect(
    react(`
function Foo() {
  return <div></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div");
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('text child', () => {
  expect(
    react(`
function Foo() {
  return <div>Foo</div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", null, "Foo");
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('one static child element', () => {
  expect(
    react(`
function Foo() {
  return <div><span /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", null, $$_h("span"));
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('multiple static child elements', () => {
  expect(
    react(`
function Foo() {
  return <div><span></span><span></span></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", null, $$_h("span"), $$_h("span"));
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('one dynamic child element', () => {
  expect(
    react(`
function Foo() {
  return <div><span on:click={onClick} /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_listen(el, "click", onClick);
            }
        }
        return $$_h("div", null, $$_h("span", {
            ref: $_ref_1.set
        }));
    }
    "
  `);
});

test('multiple dynamic child elements', () => {
  expect(
    react(`
function Foo() {
  return <div><span on:click={onA} /><span on:click={onB} /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
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
        return $$_h("div", null, $$_h("span", {
            ref: $_ref_1.set
        }), $$_h("span", {
            ref: $_ref_2.set
        }));
    }
    "
  `);
});

test('one static child expression', () => {
  expect(
    react(`
function Foo() {
  return <div>{"foo"}</div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", null, "foo");
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('one dynamic child expression', () => {
  expect(
    react(`
function Foo() {
  return <div>{a()}</div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_expression, $$_h } from "@maverick-js/react";
    function Foo() {
        return $$_h("div", null, $$_expression(a()));
    }
    "
  `);
});

test('multiple dynamic child expressions', () => {
  expect(
    react(`
function Foo() {
  return <div>{a() ? <div on:click={onA} /> : null}{b() ? <span on:click={onB} /> : null}</div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h, $$_expression } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        return $$_h("div", null, $$_expression(a() ? (() => {
            let $_ref_1 = $$_ref();
            if ($$_IS_CLIENT) {
                $$_on_attach($_ref_1, $_attach_1);
                function $_attach_1(el) {
                    $$_listen(el, "click", onA);
                }
            }
            return $$_h("div", {
                ref: $_ref_1.set
            });
        })() : null), $$_expression(b() ? (() => {
            let $_ref_2 = $$_ref();
            if ($$_IS_CLIENT) {
                $$_on_attach($_ref_2, $_attach_2);
                function $_attach_2(el) {
                    $$_listen(el, "click", onB);
                }
            }
            return $$_h("span", {
                ref: $_ref_2.set
            });
        })() : null));
    }
    "
  `);
});
