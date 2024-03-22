import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import { Quiz } from './types/schemas';
import { quizFactory } from './utils/factory';

type QuizSlice = {
  quiz: Quiz | null;
  errorMsg: string | null;
  setQuiz: (quiz: Quiz) => void;
  setErrorMsg: (errorMsg: string) => void;
  resetState: () => void;
};

type ActiveQuestionSlice = {
  index: number;
  direction: 1 | -1;
  moveIndex: (direction: 1 | -1) => void;
};

const useStore = create<QuizSlice & ActiveQuestionSlice>((set) => ({
  quiz: quizFactory(),
  errorMsg: null,
  setQuiz: (quiz) => set({ quiz }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  resetState: () => set({ quiz: null, errorMsg: null }),
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
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

export default useStore;
