import { Fragment, signal } from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('no children', () => {
  expect(<></>).toMatchSnapshot();
});

test('one static child', () => {
  expect(
    <>
      <div />
    </>,
  ).toMatchSnapshot();
});

test('multiple static child elements', () => {
  expect(
    <>
      <div />
      <span />
    </>,
  ).toMatchSnapshot();
});

test('one dynamic child element', () => {
  expect(
    <>
      <div on:click={noop} />
      <div on:click={noop} />
    </>,
  ).toMatchSnapshot();
});

test('one static child expression', () => {
  expect(<>{'foo'}</>).toMatchSnapshot();
});

test('one dynamic child text expression', () => {
  const content = 'foo';
  expect(<>{content}</>).toMatchSnapshot();
});

test('multiple dynamic child expressions', () => {
  const $showA = signal(true),
    $showB = signal(true);
  expect(
    <>
      {() => ($showA() ? <div on:pointerup={noop} /> : null)}
      {() => ($showB() ? <span on:pointerdown={noop} /> : null)}
    </>,
  ).toMatchSnapshot();
});

test('<Fragment>', () => {
  expect(
    <Fragment>
      <div></div>
      <span></span>
      {() => <div />}
    </Fragment>,
  ).toMatchSnapshot();
});
