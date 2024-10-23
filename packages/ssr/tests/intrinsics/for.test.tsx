import { For, signal } from '@maverick-js/core';

it('should render non-keyed loop', () => {
  const $each = signal([1, 2, 3]);

  expect(
    <For each={$each}>
      {(item, i) => (
        <span>
          {item} - {i}
        </span>
      )}
    </For>,
  ).toMatchSnapshot();
});
