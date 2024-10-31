import { react } from '../../transform';

test('static', () => {
  expect(
    react(`
function Foo() {
  return <svg prop:width={1920}/>
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_props_1 = /* @__PURE__ */ {
        ref: $_attach_1
    };
    function $_attach_1(el) {
        el.width = 1920;
    }
    function Foo() {
        return $$_h("svg", $_props_1);
    }
    "
  `);
});

test('multiple static', () => {
  expect(
    react(`
function Foo() {
  return <svg prop:width={1920} prop:height={1080} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_h } from "@maverick-js/react";
    let $_props_1 = /* @__PURE__ */ {
        ref: $_attach_1
    };
    function $_attach_1(el) {
        el.width = 1920;
        el.height = 1080;
    }
    function Foo() {
        return $$_h("svg", $_props_1);
    }
    "
  `);
});

test('dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg prop:width={calcWidth} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    function Foo() {
        let $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            el.width = calcWidth;
        }
        return $$_h("svg", {
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('multiple dynamic', () => {
  expect(
    react(`
function Foo() {
  return <svg prop:width={calcWidth} prop:height={calcHeight} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    function Foo() {
        let $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            el.width = calcWidth;
            el.height = calcHeight;
        }
        return $$_h("svg", {
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('signal', () => {
  expect(
    react(`
function Foo() {
  return <svg $prop:width={calcWidth} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_prop } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_prop(el, "width", calcWidth);
        }
        return $$_h("svg", {
            ref: $_ref_1.set
        });
    }
    "
  `);
});

test('multiple signals', () => {
  expect(
    react(`
function Foo() {
  return <svg $prop:width={calcWidth} $prop:height={calcHeight} />
}
`),
  ).toMatchInlineSnapshot(`
    "import { $$_signal, $$_on_attach, $$_h } from "@maverick-js/react";
    import { $$_prop } from "@maverick-js/dom";
    function Foo() {
        let $_ref_1 = $$_signal(null);
        $$_on_attach($_ref_1, $_attach_1);
        function $_attach_1(el) {
            $$_prop(el, "width", calcWidth);
            $$_prop(el, "height", calcHeight);
        }
        return $$_h("svg", {
            ref: $_ref_1.set
        });
    }
    "
  `);
});
