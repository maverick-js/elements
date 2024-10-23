import { signal } from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('no children', () => {
  expect(<div />).toMatchSnapshot();
});

test('text child', () => {
  expect(<div>Foo</div>).toMatchSnapshot();
});

test('static child elements', () => {
  expect(
    <div>
      <span></span>
      <span></span>
    </div>,
  ).toMatchSnapshot();
});

test('dynamic child elements', () => {
  expect(
    <div>
      <span on:pointerup={noop}></span>
      <span on:pointerdown={noop}></span>
    </div>,
  ).toMatchSnapshot();
});

test('static child expression', () => {
  expect(<div>{'Foo'}</div>).toMatchSnapshot();
});

test('dynamic text child expression', () => {
  const text = 'Foo';
  expect(<div>{text}</div>).toMatchSnapshot();
});

test('multiple dynamic child expressions', () => {
  const $showA = signal(true),
    $showB = signal(true);

  expect(
    <div>
      {() => ($showA() ? <div on:pointerup={noop} /> : null)}
      {() => ($showB() ? <span on:pointerdown={noop} /> : null)}
    </div>,
  ).toMatchSnapshot();
});
