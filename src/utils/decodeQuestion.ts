import { decode } from 'html-entities';

import { Question } from '../types/schemas';

export default function decodeQuestion(q: Question) {
  return {
    type: q.type,
    question: decode(q.question),
    category: decode(q.category),
    difficulty: q.difficulty,
    correct_answer: decode(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map((a) => decode(a)),
  };
}
