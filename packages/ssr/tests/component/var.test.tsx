import { Component, type CustomElementOptions, Host, type JSX, signal } from '@maverick-js/core';

test('host vars', () => {
  type Color = 'red' | 'orange';

  interface CssProps {
    color: Color;
    'bg-color': Color;
    'z-index': number;
  }

  class Foo extends Component<{ cssProps: CssProps }> {
    static element: CustomElementOptions = {
      name: '',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return <Host style="background-color: var(--bg-color); z-index: var(--z-index);" />;
    }
  }

  const $color = signal<Color>('red'),
    bgColor = 'red';

  expect(<Foo $var:color={$color} $var:bg-color={bgColor} $var:z-index={20} />).toMatchSnapshot();
});
