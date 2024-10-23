import { Component, type CustomElementOptions, Host, type JSX, signal } from '@maverick-js/core';

test('host vars', () => {
  class Foo extends Component {
    static element: CustomElementOptions = {
      name: '',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return <Host class="foo"></Host>;
    }
  }

  const $bar = signal(true),
    bux = false;

  expect(<Foo class="..." $class:bar={$bar} class:bux={bux} />).toMatchSnapshot();
});
