import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import { quizFactory } from '../utils/factory';
import { createActiveQuestionSlice } from './createActiveQuestionSlice';
import { createPickedSlice } from './createPickedSlice';
import { createQuizSlice } from './createQuizSlice';
import { AllSlices } from './types';

const useMainStore = create<AllSlices>()((...a) => ({
  ...createQuizSlice(...a),
  ...createActiveQuestionSlice(...a),
  ...createPickedSlice(...a),
}));

const fakeQuiz = quizFactory(15);

useMainStore.setState({
  quiz: fakeQuiz,
  picked: Array.from({ length: fakeQuiz.length }),
});

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('MainStore', useMainStore);
}

export default useMainStore;
