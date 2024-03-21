import { decode } from 'html-entities';

import { QuestionShuffled } from '../types/schemas';

export default function decodeQuestion(q: QuestionShuffled) {
  return {
    type: q.type,
    question: decode(q.question),
    category: decode(q.category),
    difficulty: q.difficulty,
    correct_answer: decode(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map((a) => decode(a)),
    answers: q.answers.map(({ value, correct }) => ({
      value: decode(value),
      correct,
    })),
  };
}
