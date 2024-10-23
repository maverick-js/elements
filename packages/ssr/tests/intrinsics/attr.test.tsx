import { signal } from '@maverick-js/core';

test('static', () => {
  expect(<div data-foo={1920} data-bar={1080} />).toMatchSnapshot();
});

test('dynamic', () => {
  const foo = 1920,
    bar = 1080;
  expect(<div data-foo={foo} data-bar={bar} />).toMatchSnapshot();
});

test('signal', () => {
  const $foo = signal(1920);
  expect(<div $data-foo={$foo} />).toMatchSnapshot();
});
