import { signal } from '@maverick-js/core';

test('static', () => {
  expect(<div innerHTML="<span>Hello</span>" />).toMatchSnapshot();
});

test('dynamic', () => {
  const innerHTML = '<span>Hello</span>';
  expect(<div innerHTML={innerHTML} />).toMatchSnapshot();
});

test('signal', () => {
  const $innerHTML = signal('<span>Yes</span>');

  function render() {
    return <div $innerHTML={$innerHTML} />;
  }

  expect(render()).toMatchSnapshot();

  $innerHTML.set('No');

  expect(render()).toMatchSnapshot();
});
