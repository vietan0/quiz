import { faker } from '@faker-js/faker';

import { categoryNames, difficulty } from '../types/api-data';
import { QuestionShuffled } from '../types/schemas';
import shuffleAnswers from './shuffleAnswers';

function questionFactory(): QuestionShuffled {
  const genAnswer = () =>
    faker.lorem.sentence({ min: 1, max: 4 }).split('.')[0];

  const correct_answer = genAnswer();
  const incorrect_answers = [genAnswer(), genAnswer(), genAnswer()];
  const answers = shuffleAnswers(correct_answer, incorrect_answers);

  return {
    type: 'multiple',
    difficulty: faker.helpers.arrayElement(difficulty),
    category: faker.helpers.arrayElement(categoryNames),
    question: faker.lorem.sentence({ min: 5, max: 10 }).replace('.', '?'),
    correct_answer,
    incorrect_answers,
    answers,
  };
}

function quizFactory() {
  return Array.from({ length: 5 }).map((_) => questionFactory());
}

export { questionFactory, quizFactory };
