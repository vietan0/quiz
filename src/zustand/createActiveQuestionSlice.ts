import { StateCreator } from 'zustand';

import { ActiveQuestionSlice, AllSlices } from './types';

export const createActiveQuestionSlice: StateCreator<
  AllSlices,
  [],
  [],
  ActiveQuestionSlice
> = (set) => ({
  index: 0,
  direction: 1,
  moveIndex: (direction) =>
    set(({ quiz, index }) => {
      if (
        (direction === -1 && index === 0) ||
        (direction === 1 && index === quiz!.length - 1)
      )
        return { index, direction };

      return { index: index + direction, direction };
    }),
  setIndex: (newIndex: number) =>
    set(({ index, direction }) => {
      let newDirection = direction;
      if (newIndex < index) newDirection = -1;
      else if (newIndex > index) newDirection = 1;

      return { index: newIndex, direction: newDirection };
    }),
});
