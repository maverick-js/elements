import { Component, type CustomElementOptions, Host } from '@maverick-js/core';

class Foo extends Component {
  static element: CustomElementOptions = {
    name: 'mk-foo',
    fallbackTag: 'div',
  };

  override render() {
    return (
      <Host class="foo" data-foo>
        <div>Foo Content</div>
        <Bar />
        <Hux />
      </Host>
    );
  }
}

class Bar extends Foo {
  static override element: CustomElementOptions = {
    name: 'mk-bar',
    fallbackTag: 'span',
  };

  override render() {
    return (
      <Host class="bar" data-bar>
        <div>Bar Content</div>
      </Host>
    );
  }
}

class Hux extends Component {
  static element: CustomElementOptions = {
    name: 'mk-hux',
    fallbackTag: 'div',
    shadowRoot: true,
  };

  override render() {
    return (
      <Host data-hux>
        <div>Hux Content</div>
      </Host>
    );
  }
}

test('render', () => {
  expect(<Foo />).toMatchSnapshot();
});
