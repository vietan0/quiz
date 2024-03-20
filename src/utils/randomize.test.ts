import { expect, test, vi } from 'vitest';

import randomize from './randomize';

test('Never return an index outside the expected', () => {
  const spyRandomize = vi.fn(randomize);

  for (let i = 0; i < 100; i++) {
    spyRandomize([0, 1, 2, 3, 4, 5]);
  }

  const results = spyRandomize.mock.results.map((result) => result.value);
  expect(results).not.toContainEqual(6);
  expect(results).not.toContainEqual(-1);
});
