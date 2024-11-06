import {
  Component,
  createSlot,
  type CustomElementOptions,
  Fragment,
  getSlots,
  Host,
  type JSX,
  signal,
  type Slot,
  tick,
} from '@maverick-js/core';
import { render } from '@maverick-js/dom';

const target = document.body;

afterEach(() => {
  target.textContent = '';
});

test('host vars', () => {
  class Foo extends Component {
    static element: CustomElementOptions = {
      name: '',
      fallbackTag: 'div',
    };

    override render(): JSX.Element {
      return <Host class="foo"></Host>;
    }
  }

  const $bar = signal(true),
    bux = false;

  render(() => <Foo $class:bar={$bar} class:bux={bux} />, { target });

  expect(target).toMatchSnapshot();

  $bar.set(false);
  tick();

  expect(target).toMatchSnapshot();
});

test('children', () => {
  interface Slots {
    default: Slot;
    foo: Slot;
  }

  class Foo extends Component<{
    slots: Slots;
  }> {
    static Slot = createSlot<Slots>();

    override render(): JSX.Element {
      const slots = getSlots<Slots>();
      return (
        <div>
          {slots.default()}
          {slots.foo()}
        </div>
      );
    }
  }

  function Bar() {
    return <div>Bar Component</div>;
  }

  expect(
    <Foo>
      <span>Default Slot</span>
      <Fragment slot="foo">
        <Bar />
        <span>Foo Slot</span>
      </Fragment>
    </Foo>,
  ).toMatchSnapshot();
});
