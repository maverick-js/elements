import { signal } from '@maverick-js/core';

test('static', () => {
  expect(<div class="..." class:foo />).toMatchSnapshot();
});

test('dynamic', () => {
  let foo = true;

  function render() {
    return <div class="..." class:foo={foo} />;
  }

  expect(render()).toMatchSnapshot();
  foo = false;
  expect(render()).toMatchSnapshot();
});

test('signal', () => {
  const $foo = signal(true);

  function render() {
    return <div $class:foo={$foo} />;
  }

  expect(render()).toMatchSnapshot();

  $foo.set(false);
  expect(render()).toMatchSnapshot();
});

test('with dynamic base', () => {
  const $foo = signal(true),
    classes = 'bar bux';

  expect(<div class={classes} $class:foo={$foo} />).toMatchSnapshot();
});

test('with signal base', () => {
  const $foo = signal(true),
    $class = signal('bar bux');

  function render() {
    return <div $class={$class} $class:foo={$foo} />;
  }

  expect(render()).toMatchSnapshot();

  $foo.set(false);
  expect(render()).toMatchSnapshot();
});
