import { dom } from '../transform';

test('add element symbol', () => {
  expect(
    dom(
      `
import { Component } from '@maverick-js/core';

class Foo extends Component {
  static element = {
    name: 'foo-element'
  }
}

class Bar extends Component {
  static element = {
    name: 'bar-element'
  }
}

class Hux extends Component {}

class Lux {}
    `,
      { customElements: true },
    ),
  ).toMatchInlineSnapshot(`
    "import { $$_define_custom_element } from "@maverick-js/element";
    import { DEFINE_ELEMENT_SYMBOL } from "@maverick-js/core";
    import { Component } from '@maverick-js/core';
    class Foo extends Component {
        static [DEFINE_ELEMENT_SYMBOL]() {
            return $$_define_custom_element(this);
        }
        static element = {
            name: 'foo-element'
        };
    }
    class Bar extends Component {
        static [DEFINE_ELEMENT_SYMBOL]() {
            return $$_define_custom_element(this);
        }
        static element = {
            name: 'bar-element'
        };
    }
    class Hux extends Component {
    }
    class Lux {
    }
    "
  `);
});

test('should import node', () => {
  expect(
    dom(
      `
import { Component } from '@maverick-js/core';

class Foo extends Component {
  static element = {
    name: 'bar-element'
  }

  render() {
    return <div><foo-bar></foo-bar></div>
  }
}`,
    ),
  ).toMatchInlineSnapshot(`
    "import { Component } from '@maverick-js/core';
    import { $$_create_template } from "@maverick-js/dom";
    let $_template_1 = /* @__PURE__ */ $$_create_template("<div><foo-bar></foo-bar></div>", true);
    class Foo extends Component {
        static element = {
            name: 'bar-element'
        };
        render() {
            return $_template_1();
        }
    }
    "
  `);
});
