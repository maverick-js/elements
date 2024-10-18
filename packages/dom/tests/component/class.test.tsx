import { render } from '@maverick-js/dom';
import { type MaverickFunctionProps, signal, tick } from 'maverick.js';

const target = document.body;

afterEach(() => {
  target.textContent = '';
});

test('host vars', () => {
  type Props = MaverickFunctionProps<HTMLElement>;

  function Foo(props: Props) {
    return <div class="foo"></div>;
  }

  const $bar = signal(true),
    bux = false;

  render(() => <Foo $class:bar={$bar} class:bux={bux} />, { target });

  expect(target).toMatchSnapshot();

  $bar.set(false);
  tick();

  expect(target).toMatchSnapshot();
});
