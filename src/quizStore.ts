import { create } from 'zustand';

import { Quiz } from './types/schemas';
import { quizFactory } from './utils/factory';

type State = {
  quiz: Quiz | null;
  errorMsg: string | null;
};

type Action = {
  setQuiz: (quiz: Quiz) => void;
  setErrorMsg: (errorMsg: string) => void;
  resetState: () => void;
};

const useQuizStore = create<State & Action>((set) => ({
  quiz: quizFactory(),
  errorMsg: null,
  setQuiz: (quiz) => set({ quiz }),
  setErrorMsg: (errorMsg) => set({ errorMsg }),
  resetState: () => set({ quiz: null, errorMsg: null }),
}));

export default useQuizStore;
