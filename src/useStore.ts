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
  moveIndex: (move: 1 | -1) => void;
};

const useStore = create<QuizSlice & ActiveQuestionSlice>((set) => ({
  quiz: quizFactory(),
  errorMsg: null,
  setQuiz: (quiz) => set({ quiz }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  resetState: () => set({ quiz: null, errorMsg: null }),
  index: 0,
  moveIndex: (move) =>
    set(({ quiz, index }) => {
      if (
        (move === -1 && index === 0) ||
        (move === 1 && index === quiz!.length - 1)
      )
        return { index };

      return { index: index + move };
    }),
}));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

export default useStore;
