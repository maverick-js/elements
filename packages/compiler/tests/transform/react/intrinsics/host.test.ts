import { react } from '../../transform';

test('import', () => {
  expect(
    react(`
import { Host } from '@maverick-js/core';

<Host class="..." style="..." autofocus $title={title} class:foo var:foo={10} on:click={onClick}>
  <div>...</div>
</Host>
    `),
  ).toMatchInlineSnapshot(`
    "import { Host, $$_h, $$_IS_CLIENT, $$_create_component } from "@maverick-js/react";
    import { $$_listen, $$_append_class, $$_class, $$_style } from "@maverick-js/dom";
    let $_static_node_1 = /* @__PURE__ */ $$_h("div", null, "...");
    (() => {
        let $_component_1 = $$_create_component(Host, {
            "style": "...",
            "autofocus": true,
            "$title": title
        }, $$_IS_CLIENT ? instance => {
            $$_listen(instance, "click", onClick);
        } : null, {
            "default": () => $_static_node_1
        }, host => {
            $$_append_class(host, "...");
            $$_class(host, "foo", true);
            $$_style(host, "--foo", 10);
        });
        return $_component_1;
    })();
    "
  `);
});
