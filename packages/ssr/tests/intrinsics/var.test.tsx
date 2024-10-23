import { signal } from '@maverick-js/core';

test('static', () => {
  expect(<div var:foo={1} var:bar={2} />).toMatchSnapshot();
});

test('dynamic', () => {
  const foo = 'blue',
    bar = 50,
    car = null;

  expect(<div var:foo={foo} var:bar={bar} var:car={car} />).toMatchSnapshot();
});

test('signal', () => {
  const color = signal<string | null>('blue');
  expect(<div $var:color={color} />).toMatchSnapshot();
});
