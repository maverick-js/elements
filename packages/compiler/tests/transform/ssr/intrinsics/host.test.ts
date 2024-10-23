import { ssr } from '../../transform';

test('import', () => {
  expect(
    ssr(`
import { Host } from '@maverick-js/core';

<Host autofocus $class={$class} $title={title} class:foo var:foo={10} on:click={onClick}>
  <div>...</div>
</Host>
    `),
  ).toMatchInlineSnapshot(`
    "import { Host, $$_unwrap, $$_create_component } from "@maverick-js/ssr";
    $$_create_component(Host, {
        "autofocus": true,
        "$title": title
    }, {
        "default": () => "<div>...</div>"
    }, {
        class: $$_unwrap($class),
        $class: {
            "foo": true
        },
        $var: {
            "--foo": 10
        }
    });
    "
  `);
});
