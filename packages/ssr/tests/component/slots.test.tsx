import {
  createSlot,
  Fragment,
  getSlots,
  type HasSlots,
  type ReadSignal,
  signal,
  type Slot,
} from '@maverick-js/core';
import { noop } from '@maverick-js/std';

test('text', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots();
    return slots.default?.();
  }

  expect(<Foo>Hello World!</Foo>).toMatchSnapshot();
});

test('single static element in default slot', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots();
    return slots.default?.();
  }

  expect(
    <Foo>
      <div />
    </Foo>,
  ).toMatchSnapshot();
});

test('single static element in named slot', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots<{ named: Slot }>();
    return slots.named?.();
  }

  expect(
    <Foo>
      <div slot="named" />
    </Foo>,
  ).toMatchSnapshot();
});

test('multiple static elements in named slot', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots<{ named: Slot }>();
    return slots.named?.();
  }

  expect(
    <Foo>
      <Fragment slot="named">
        <div />
        <div />
      </Fragment>
    </Foo>,
  ).toMatchSnapshot();
});

test('dynamic elements', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots();
    return slots.default?.();
  }

  expect(
    <Foo>
      <div on:click={noop} />
      <div on:click={noop} />
    </Foo>,
  ).toMatchSnapshot();
});

test('namespaced slot', () => {
  interface Slots {
    default: Slot;
    named: Slot;
  }

  function Foo(props: HasSlots) {
    const slots = getSlots<Slots>();
    return [slots.default(), slots.named()];
  }

  Foo.Slot = createSlot<Slots>();

  expect(
    <Foo>
      <Foo.Slot>
        <div />
        <div />
      </Foo.Slot>
      <Foo.Slot name="named">
        <span />
        <span />
      </Foo.Slot>
    </Foo>,
  ).toMatchSnapshot();
});

test('render function', () => {
  interface Slots {
    default: Slot<{ a: number; b: number; $c: ReadSignal<number> }>;
  }

  const $c = signal(0);

  function Foo(props: HasSlots) {
    const slots = getSlots<Slots>();
    return <div>{slots.default({ a: 10, b: 20, $c })}</div>;
  }

  expect(
    <Foo>
      {({ a, b, $c }) => (
        <span>
          {a} - {b} - {$c}
        </span>
      )}
    </Foo>,
  ).toMatchSnapshot();
});
