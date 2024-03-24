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
  setIndex: (index: number) => void;
};

type PickedSlice = {
  picked: string[] | null;
  setPicked: (answer: string, qIndex: number) => void;
};

const useMainStore = create<QuizSlice & ActiveQuestionSlice & PickedSlice>(
  (set) => {
    return {
      quiz: null,
      quizErrMsg: null,
      setQuiz: (quiz) =>
        set({ quiz, picked: Array.from({ length: quiz.length }) }),
      setquizErrMsg: (quizErrMsg) => set({ quizErrMsg }),
      resetQuiz: () =>
        set({
          quiz: null,
          quizErrMsg: null,
          index: 0,
          direction: 1,
          picked: null,
        }),
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
      setIndex: (index: number) =>
        set((state) => {
          const direction =
            index < state.index
              ? -1
              : index > state.index
                ? 1
                : state.direction;

          return { index, direction };
        }),
      picked: null,
      setPicked: (answer: string, qIndex: number) => {
        set((state) => {
          const updatedPicked = state.picked!.map((prev, i) =>
            i === qIndex ? answer : prev,
          );

          return { picked: updatedPicked };
        });
      },
    };
  },
);

const fakeQuiz = quizFactory(30);

useMainStore.setState({
  quiz: fakeQuiz,
  picked: Array.from({ length: fakeQuiz.length }),
});

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useMainStore);
}

export default useMainStore;
