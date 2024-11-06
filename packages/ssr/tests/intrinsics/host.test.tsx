import { Component, type CustomElementOptions, Host, type JSX, signal } from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('<Host>', () => {
  class Foo extends Component {
    static element: CustomElementOptions = {
      name: 'mk-foo',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return (
        <Host class="foo" data-foo class:bar var:foo={10} on:click={noop}>
          <span>Contents</span>
        </Host>
      );
    }
  }

  expect(<Foo />).toMatchSnapshot();
});

test('attach to host', () => {
  const $foo = signal(10),
    ref = vi.fn();

  class Foo extends Component<{
    cssProps: {
      foo: number;
    };
  }> {
    static element: CustomElementOptions = {
      name: 'mk-foo',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return (
        <Host class="foo" style="background-color: red;">
          <span>Contents</span>
        </Host>
      );
    }
  }

  expect(<Foo class="bar" data-foo class:hux $var:foo={$foo} ref={ref} />).toMatchSnapshot();
});
