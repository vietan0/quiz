import { StateCreator } from 'zustand';

import { AllSlices, PickedSlice } from './types';

export const createPickedSlice: StateCreator<AllSlices, [], [], PickedSlice> = (
  set,
) => ({
  picked: null,
  setPicked: (answer: string, qIndex: number) => {
    set(({ picked }) => {
      const newPicked = picked!.map((prev, i) =>
        i === qIndex ? answer : prev,
      );

      return { picked: newPicked };
    });
  },
});
