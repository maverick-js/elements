import { Component, type CustomElementOptions, Host } from '@maverick-js/core';
import { render } from '@maverick-js/dom';
import type { MaverickElement } from '@maverick-js/element';

const target = document.body;

afterEach(() => {
  target.textContent = '';
});

class Foo extends Component {
  static element: CustomElementOptions = {
    name: 'mk-foo',
    fallbackTag: 'div',
  };

  get foo() {
    return 10;
  }

  bar() {
    // no-op
  }

  override render() {
    return (
      <Host data-foo>
        <div>Foo Content</div>
        <Bar />
      </Host>
    );
  }
}

class Bar extends Foo {
  static override element: CustomElementOptions = {
    name: 'mk-bar',
    fallbackTag: 'div',
  };

  get hux() {
    return 20;
  }

  bux() {
    // no-op
  }

  override render() {
    return (
      <Host data-bar>
        <div>Bar Content</div>
      </Host>
    );
  }
}

test('render', () => {
  render(() => <Foo />, { target });

  expect(target).toMatchSnapshot();

  const fooEl = target.querySelector('mk-foo') as MaverickElement<Foo>,
    barEl = target.querySelector('mk-bar') as MaverickElement<Bar>;

  expect(fooEl.foo).toBe(10);
  expect(fooEl.bar).toBeDefined();

  expect(barEl.foo).toBe(10);
  expect(barEl.hux).toBe(20);
  expect(barEl.bar).toBeDefined();
  expect(barEl.bux).toBeDefined();
});
