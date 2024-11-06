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
} from '@maverick-js/core';

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

  expect(<Foo class="..." $class:bar={$bar} class:bux={bux} />).toMatchSnapshot();
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
