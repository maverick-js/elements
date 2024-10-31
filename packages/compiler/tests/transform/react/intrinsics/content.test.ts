import { react } from '../../transform';

test('static', () => {
  expect(
    react(`
function Foo() {
  return <div innerHTML="<div></div>"><span /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_set_html, $$_h } from "@maverick-js/react";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", $$_set_html("<div></div>"));
    function Foo() {
        return $_static_node_1;
    }
    "
  `);
});

test('dynamic', () => {
  expect(
    react(`
function Foo() {
  return <div innerHTML={content}><span /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    function Foo() {
        return $$_h("div", {
            dangerouslySetInnerHTML: { __html: content }
        });
    }
    "
  `);
});

test('signal', () => {
  expect(
    react(`
function Foo() {
  return <div $innerHTML={content}><span /></div>
}`),
  ).toMatchInlineSnapshot(`
    "import { $$_IS_SERVER, $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_content } from "@maverick-js/dom";
    import { $$_unwrap } from "@maverick-js/ssr";
    function Foo() {
        let $_ssr_attrs_1 = $$_IS_SERVER ? {
            dangerouslySetInnerHTML: { __html: $$_unwrap(content) }
        } : null, $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_content(el, "innerHTML", content);
        }
        return $$_h("div", {
            ...$_ssr_attrs_1,
            suppressHydrationWarning: true,
            ref: $_ref_1.set
        });
    }
    "
  `);
});
