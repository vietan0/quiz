import { StateCreator } from 'zustand';

import { AllSlices, ResultSlice } from './types';

export const createResultSlice: StateCreator<AllSlices, [], [], ResultSlice> = (
  set,
) => ({
  result: null,
  setResult: () =>
    set(({ quiz, picked }) => {
      const correctMap = picked!.map(
        (pick, i) => pick === quiz![i].correct_answer,
      );

      const correctCount = correctMap.filter((x) => Boolean(x)).length;
      const percentage = Math.floor((correctCount * 100) / correctMap.length);
      let msgs = { main: '', sub: '' };

      if (percentage < 50) {
        msgs = {
          main: "😭 I don't feel so good Mr. Stark...",
          sub: 'Maybe try some easier questions?',
        };
      } else if (percentage < 75) {
        msgs = { main: '👍 Good!', sub: 'Could be improved.' };
      } else if (percentage < 100) {
        msgs = { main: '😍 Very well!', sub: "You're on the right track!" };
      } else
        msgs = {
          main: '✨ Perfect!',
          sub: 'You left no crumbs! Challenge yourself with greater difficulty!',
        };

      return {
        result: {
          correctMap,
          correctCount,
          percentage,
          msgs,
        },
      };
    }),
});
