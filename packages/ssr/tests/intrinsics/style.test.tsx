import { signal } from '@maverick-js/core';

test('static', () => {
  expect(<div style:color="blue" />).toMatchSnapshot();
});

test('dynamic', () => {
  const color = 'blue',
    bgColor = 'red';
  expect(<div style:color={color} style:backgroundColor={bgColor} />).toMatchSnapshot();
});

test('signal', () => {
  const color = signal<string | null>('blue');
  expect(<div $style:color={color} />).toMatchSnapshot();
});

test('with dynamic base', () => {
  const $color = signal('red'),
    styles = 'background-color: pink;';
  expect(<div style={styles} $style:color={$color} />).toMatchSnapshot();
});

test('with signal base', () => {
  const $color = signal('red'),
    $style = signal('background-color: red;');

  expect(<div $style={$style} $style:color={$color} />).toMatchSnapshot();
});
