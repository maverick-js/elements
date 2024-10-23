import { signal } from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('one spread', () => {
  const spread = {
    'data-foo': '',
    'class:foo': true,
    'style:color': 'var(--color)',
    'var:color': 'blue',
    'on:click': noop,
  };

  expect(<div {...spread} />).toMatchSnapshot();
});

test('multiple spreads', () => {
  const $bgColor = signal('red'),
    $class = signal('bar bux');

  const spreadA = {
    'data-foo': '',
    'class:foo': true,
    'style:color': 'var(--color)',
    'var:color': 'blue',
    'on:click': noop,
  };

  const spreadB = {
    'class:hux': true,
    'class:lux': false,
    'data-bar': '',
    '$style:backgroundColor': $bgColor,
    'var:color': 'red',
    'on:pointerup': noop,
  };

  expect(<div $class={$class} style="--foo: 10;" {...spreadA} {...spreadB} />).toMatchSnapshot();
});
