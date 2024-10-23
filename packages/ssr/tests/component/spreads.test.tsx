import { Component, type CustomElementOptions, Host, type JSX, signal } from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('one spread', () => {
  const spread = {
    'class:foo': true,
    'var:color': 'blue',
    'on:click': noop,
  };

  class Foo extends Component {
    static element: CustomElementOptions = {
      name: '',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return <Host class="boo" />;
    }
  }

  expect(<Foo {...spread} />).toMatchSnapshot();
});

test('multiple spreads', () => {
  const $bgColor = signal('red');

  const spreadA = {
    'class:foo': true,
    'var:color': 'blue',
    'on:click': noop,
  };

  const spreadB = {
    'class:hux': true,
    'class:lux': false,
    'var:color': 'red',
    '$var:bgColor': $bgColor,
    'on:pointerup': noop,
  };

  class Foo extends Component {
    static element: CustomElementOptions = {
      name: '',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return <Host class="zux" style="z-index: 10;" />;
    }
  }

  expect(<Foo class="hux" {...spreadA} {...spreadB} />).toMatchSnapshot();
});
