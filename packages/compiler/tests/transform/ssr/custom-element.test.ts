import { ssr } from '../transform';

test('add element symbol', () => {
  expect(
    ssr(
      `
import { Component } from '@maverick-js/core';
class Foo extends Component {
  static element = {
    name: 'foo-element'
  }
}`,
      { customElements: true },
    ),
  ).toMatchInlineSnapshot(`
    "import { DEFINE_ELEMENT_SYMBOL } from "@maverick-js/core";
    import { Component } from '@maverick-js/core';
    class Foo extends Component {
        static [DEFINE_ELEMENT_SYMBOL]() {
            return true;
        }
        static element = {
            name: 'foo-element'
        };
    }
    "
  `);
});
