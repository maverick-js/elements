import { ssr } from '../../transform';

test('import', () => {
  expect(
    ssr(`
import { For } from '@maverick-js/core';

<For each={[0, 1, 2]}>
  {(item, index) => <div>{item} - {index}</div>}
</For>
    `),
  ).toMatchInlineSnapshot(`
    "import { For, $$_escape, $$_ssr, $$_create_component } from "@maverick-js/ssr";
    let $$_template_1 = ["<div>", " - ", "</div>"];
    $$_create_component(For, {
        "each": [0, 1, 2]
    }, {
        "default": (item, index) => $$_ssr($$_template_1, [$$_escape(item), $$_escape(index)])
    });
    "
  `);
});
