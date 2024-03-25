import { StateCreator } from 'zustand';

import { AllSlices, ResultSlice } from './types';

export const createResultSlice: StateCreator<AllSlices, [], [], ResultSlice> = (
  set,
) => ({
  result: null,
  setResult: (result) => set({ result }),
});
