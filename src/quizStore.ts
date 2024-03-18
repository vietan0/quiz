import { create } from 'zustand';

import { Quiz } from './types/schemas';

type State = {
  quiz: Quiz | null;
};

type Action = {
  setQuiz: (quiz: Quiz) => void;
  resetQuiz: () => void;
};

const useQuizStore = create<State & Action>((set) => ({
  quiz: null,
  setQuiz: (quiz) => set({ quiz }),
  resetQuiz: () => set({ quiz: null }),
}));

export default useQuizStore;
