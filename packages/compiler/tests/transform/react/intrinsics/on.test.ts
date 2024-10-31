import { react } from '../../transform';

test('on', () => {
  expect(
    react(`
function Foo() {
  return <div on:click={onClick} />
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_listen(el, "click", onClick);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('capture', () => {
  expect(
    react(`
function Foo() {
  return <div on_capture:click={onClick} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_listen(el, "click", onClick, true);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});

test('multiple', () => {
  expect(
    react(`
function Foo() {
  return <div on:pointerdown={onDown} on:pointerup={onUp}  />
}
    `),
  ).toMatchInlineSnapshot(`
    "import { $$_get_scope, $$_attach_callback, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_scope_1 = $$_get_scope(), $_node_1 = $$_h($_render_1);
        function $_attach_1(el) {
            $$_listen(el, "pointerdown", onDown);
            $$_listen(el, "pointerup", onUp);
        }
        function $_render_1() {
            let $_ref_1 = $$_IS_CLIENT ? $$_attach_callback($_scope_1, $_attach_1) : null;
            return $$_h("div", {
                ref: $_ref_1
            });
        }
        return $_node_1;
    }
    "
  `);
});
