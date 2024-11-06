import { react } from '../../transform';

test('import', () => {
  expect(
    react(`
import { For } from '@maverick-js/core';

function Foo() {
 return (
  <For each={[0, 1, 2]}>
    {(item, index) => <div>{item} - {index}</div>}
  </For>
 );
}
    `),
  ).toMatchInlineSnapshot(`
    "import { For, $$_expression, $$_h, $$_create_component } from "@maverick-js/react";
    function Foo() {
        let $_component_1 = $$_create_component(For, {
            "each": [0, 1, 2]
        }, null, {
            "default": (item, index) => $$_h("div", null, $$_expression(item), " - ", $$_expression(index))
        });
        return ($_component_1);
    }
    "
  `);
});
