import {
  Component,
  createComponent,
  createScope,
  createStore,
  Instance,
  useStore,
} from '@maverick-js/core';

it('should create props', () => {
  class TestComponent extends Component<{
    props: {
      foo: number;
      bar: number;
    };
  }> {
    static props = { foo: 10, bar: 20 };
  }

  const instance = new Instance(createScope(), TestComponent.props);

  expect(instance.props.foo()).toBe(10);
  expect(instance.props.bar()).toBe(20);
});

it('should forward props', () => {
  class TestComponent extends Component<{
    props: {
      foo: number;
      bar: number;
    };
  }> {
    static props = { foo: 10, bar: 20 };
  }

  const instance = new Instance(createScope(), TestComponent.props, undefined, {
    props: { foo: 20, bar: 40 },
  });

  expect(instance.props.foo()).toBe(20);
  expect(instance.props.bar()).toBe(40);
});

it('should create state', () => {
  const TestStore = createStore({
    foo: 1,
  });

  class TestComponent extends Component<{
    state: {
      foo: number;
    };
  }> {
    static state = TestStore;

    constructor() {
      super();
      expect(this.$state.foo()).toBe(1);
      expect(useStore(TestStore)).toBeDefined();
    }
  }

  createComponent(TestComponent);
});
