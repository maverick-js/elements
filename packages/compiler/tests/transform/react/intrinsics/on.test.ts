import { react } from '../../transform';

test('on', () => {
  expect(
    react(`
function Foo() {
  return <div on:click={onClick} />
}
    `),
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
        return $$_h("div", {
            ref: $_ref_1.set
        });
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
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_listen(el, "click", onClick, true);
            }
        }
        return $$_h("div", {
            ref: $_ref_1.set
        });
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
    "import { $$_ref, $$_on_attach, $$_IS_CLIENT, $$_h } from "@maverick-js/react";
    import { $$_listen } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_ref();
        if ($$_IS_CLIENT) {
            $$_on_attach($_ref_1, $_attach_1);
            function $_attach_1(el) {
                $$_listen(el, "pointerdown", onDown);
                $$_listen(el, "pointerup", onUp);
            }
        }
        return $$_h("div", {
            ref: $_ref_1.set
        });
    }
    "
  `);
});
