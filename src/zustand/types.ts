import { Quiz } from '../types/schemas';
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
  setIndex: (newIndex: number) => void;
};

type PickedSlice = {
  picked: string[] | null;
  setPicked: (answer: string, index: number) => void;
};

type ResultSlice = {
  result: {
    correctMap: boolean[];
    correctCount: number;
    percentage: number;
    msgs: { main: string; sub: string };
  } | null;
  setResult: () => void;
};

type AllSlices = QuizSlice & ActiveQuestionSlice & PickedSlice & ResultSlice;

export type {
  ActiveQuestionSlice,
  AllSlices,
  PickedSlice,
  QuizSlice,
  ResultSlice,
};
