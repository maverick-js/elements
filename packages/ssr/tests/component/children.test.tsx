import { getSlots, type HasSlots } from '@maverick-js/core';

test('none', () => {
  function Foo() {
    return null;
  }

  expect(<Foo />).toMatchSnapshot();
});

test('expression', () => {
  function Foo(props: HasSlots) {
    const slots = getSlots();
    return slots.default?.();
  }

  const text = 'Hello World!';
  expect(<Foo>{text}</Foo>).toMatchSnapshot();
});

test('component', () => {
  function Bux() {
    return <span>Bux</span>;
  }

  function Bar(props: HasSlots) {
    const slots = getSlots();
    return (
      <>
        <span>{slots.default?.()}</span>
        <Bux />
      </>
    );
  }

  function Foo(props: HasSlots) {
    const slots = getSlots();
    return <div>{slots.default?.()}</div>;
  }

  expect(
    <Foo>
      <Bar>Bar</Bar>
    </Foo>,
  ).toMatchSnapshot();
});
