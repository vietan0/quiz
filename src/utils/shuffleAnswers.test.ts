import { expect, test, vi } from 'vitest';

import shuffleAnswers from './shuffleAnswers';

test('Likelyhood of one element being the first index is around 25%', () => {
  const spyShuffleAnswers = vi.fn(shuffleAnswers);
  const calledTimes = 1000;

  for (let i = 0; i < calledTimes; i++) {
    spyShuffleAnswers('Jim', ['Michael', 'Pam', 'Dwight']);
  }

  const jimIsFirst = spyShuffleAnswers.mock.results.filter(
    (result) => result.value[0] === 'Jim',
  );

  expect(spyShuffleAnswers).toHaveBeenCalledTimes(calledTimes);
  // anything outside [0.2, 0.3] will fail
  expect(jimIsFirst.length / calledTimes).toBeCloseTo(0.25, 1);
});
