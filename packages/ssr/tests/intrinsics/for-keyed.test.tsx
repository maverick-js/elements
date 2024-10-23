import { ForKeyed, signal } from '@maverick-js/core';

it('should render keyed loop', () => {
  const $each = signal([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);

  expect(
    <ForKeyed each={$each}>
      {(item, i) => (
        <span>
          {item.id} - {i()}
        </span>
      )}
    </ForKeyed>,
  ).toMatchSnapshot();
});
