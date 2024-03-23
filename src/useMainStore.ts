import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

import { Quiz } from './types/schemas';
import { quizFactory } from './utils/factory';

type QuizSlice = {
  quiz: Quiz | null;
  quizErrMsg: string | null;
  setQuiz: (quiz: Quiz) => void;
  setquizErrMsg: (quizErrMsg: string) => void;
  resetQuiz: () => void;
};

type ActiveQuestionSlice = {
  index: number;
  direction: 1 | -1;
  moveIndex: (direction: 1 | -1) => void;
};

const useMainStore = create<QuizSlice & ActiveQuestionSlice>((set) => ({
  quiz: quizFactory(),
  quizErrMsg: null,
  setQuiz: (quiz) => set({ quiz }),
  setquizErrMsg: (quizErrMsg) => set({ quizErrMsg }),
  resetQuiz: () => set({ quiz: null, quizErrMsg: null }),
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
  mountStoreDevtool('Store', useMainStore);
}

export default useMainStore;
