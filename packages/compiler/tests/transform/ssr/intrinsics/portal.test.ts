import { ssr } from '../../transform';

test('import', () => {
  expect(
    ssr(`
import { Portal } from "@maverick-js/core";

<Portal to="body">
  <div></div>
</Portal>
`),
  ).toMatchInlineSnapshot(`
    "import { Portal, $$_create_component, $$_ssr } from "@maverick-js/ssr";
    let $$_template_1 = [""];
    $$_ssr($$_template_1, [$$_create_component(Portal, {
            "to": "body"
        }, {
            "default": () => "<div></div>"
        })]);
    "
  `);
});
