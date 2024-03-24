import { StateCreator } from 'zustand';

import { AllSlices, QuizSlice } from './types';

export const createQuizSlice: StateCreator<AllSlices, [], [], QuizSlice> = (
  set,
) => ({
  quiz: null,
  quizErrMsg: null,
  setQuiz: (quiz) => set({ quiz, picked: Array.from({ length: quiz.length }) }),
  setquizErrMsg: (quizErrMsg) => set({ quizErrMsg }),
  resetQuiz: () =>
    set({
      quiz: null,
      quizErrMsg: null,
      index: 0,
      direction: 1,
      picked: null,
    }),
});
