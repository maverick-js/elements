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
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_listen(el, "click", onClick);
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
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_signal(null), $_ref_2 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_listen(el, "click", onA);
        }
        $$_on_attach($_ref_2, $_attach_2);
        function $_attach_2(el) {
            $$_listen(el, "click", onB);
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
    "import { $$_computed, $$_expression, $$_h } from "@maverick-js/react";
    function Foo() {
        let $_computed_1 = $$_computed(a), $_node_1 = $$_h($_render_1);
        function $_render_1() {
            let $_expression_1 = $$_expression($_computed_1);
            return $$_h("div", null, $_expression_1);
        }
        return $_node_1;
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
    "import { $$_signal, $$_on_attach, $$_h, $$_computed, $$_expression } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_signal(null), $_computed_1 = $$_computed(() => a() ? $$_h("div", {
            ref: $_ref_1.set
        }) : null), $_ref_2 = $$_signal(null), $_computed_2 = $$_computed(() => b() ? $$_h("span", {
            ref: $_ref_2.set
        }) : null), $_node_1 = $$_h($_render_1);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_listen(el, "click", onA);
        }
        $$_on_attach($_ref_2, $_attach_2);
        function $_attach_2(el) {
            $$_listen(el, "click", onB);
        }
        function $_render_1() {
            let $_expression_1 = $$_expression($_computed_1), $_expression_2 = $$_expression($_computed_2);
            return $$_h("div", null, $_expression_1, $_expression_2);
        }
        return $_node_1;
    }
    "
  `);
});
