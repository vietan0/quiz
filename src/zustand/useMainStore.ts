import { create } from 'zustand';

import { createActiveQuestionSlice } from './createActiveQuestionSlice';
import { createPickedSlice } from './createPickedSlice';
import { createQuizSlice } from './createQuizSlice';
import { createResultSlice } from './createResultSlice';
import { AllSlices } from './types';

const useMainStore = create<AllSlices>()((...a) => ({
  ...createQuizSlice(...a),
  ...createActiveQuestionSlice(...a),
  ...createPickedSlice(...a),
  ...createResultSlice(...a),
}));

export default useMainStore;
