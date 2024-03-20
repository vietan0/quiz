import { faker } from '@faker-js/faker';

import { categoryNames, difficulty } from '../types/api-data';
import { Question } from '../types/schemas';

function questionFactory(): Question {
  return {
    type: 'multiple',
    difficulty: faker.helpers.arrayElement(difficulty),
    category: faker.helpers.arrayElement(categoryNames),
    question: faker.lorem.sentence({ min: 5, max: 10 }).replace('.', '?'),
    correct_answer: faker.lorem.sentence({ min: 1, max: 4 }).split('.')[0],
    incorrect_answers: [
      faker.lorem.sentence({ min: 1, max: 4 }).split('.')[0],
      faker.lorem.sentence({ min: 1, max: 4 }).split('.')[0],
      faker.lorem.sentence({ min: 1, max: 4 }).split('.')[0],
    ],
  };
}

function quizFactory() {
  const randomLength = faker.number.int({ min: 1, max: 5 });

  return Array.from({ length: randomLength }).map((_) => questionFactory());
}

export { questionFactory, quizFactory };
