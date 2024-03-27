import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';

import routes from '../routes';
import { quizFactory } from '../utils/factory';
import useMainStore from '../zustand/useMainStore';

const user = userEvent.setup();
const { getState } = useMainStore;
const fakeQuiz = quizFactory(3);

async function renderQuiz() {
  const testRouter = createMemoryRouter(routes, {
    initialEntries: ['/quiz'],
  });

  useMainStore.setState({
    quiz: fakeQuiz,
    picked: Array.from({ length: fakeQuiz.length }),
  });

  render(<RouterProvider router={testRouter} />);
}

beforeEach(renderQuiz);
afterEach(cleanup);

test('render quiz from start', () => {
  // state: active question, picked and result are initialized
  expect(getState()).toMatchObject({
    index: 0,
    direction: 1,
    picked: [undefined, undefined, undefined],
  });

  // Previous & Submit button is disabled at index 0
  const prevBtn = screen.getByRole('button', { name: /Previous/i });
  const submitBtn = screen.getByRole('button', { name: /Submit/i });
  expect(prevBtn).toBeDisabled();
  expect(submitBtn).toBeDisabled();
});

test('When pick an answer', async () => {
  const answer1 = fakeQuiz[0].answers[0];
  const radio1 = screen.getByRole('radio', { name: answer1 });
  const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
  expect(firstQuesBtn).toHaveAttribute('data-status', 'not-picked');
  await user.click(radio1);
  // State: picked is updated
  expect(getState()).toMatchObject({ picked: [answer1, undefined, undefined] });
  // Progress/QuizStatus button's data-status is updated
  expect(firstQuesBtn).toHaveAttribute('data-status', 'picked');
});

test('When click Next/Prev', async () => {
  const prevBtn = screen.getByRole('button', { name: /Previous/i });
  const nextBtn = screen.getByRole('button', { name: /Next/i });
  const getQuestionSpan = (i: number) => screen.getByText(fakeQuiz[i].question);
  // State: index, direction is updated
  // The correct question is rendered
  await user.click(nextBtn);
  expect(getState()).toMatchObject({ index: 1, direction: 1 });
  expect(getQuestionSpan(1)).toBeInTheDocument();
  await user.click(prevBtn);
  expect(getState()).toMatchObject({ index: 0, direction: -1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
});

test('When click a Progress/QuizStatus button', async () => {
  const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
  const thirdQuesBtn = screen.getByRole('button', { name: /3rd/ });
  const getQuestionSpan = (i: number) => screen.getByText(fakeQuiz[i].question);
  // State: index, direction is updated
  // The right question is rendered
  await user.click(thirdQuesBtn);
  expect(getState()).toMatchObject({ index: 2, direction: 1 });
  expect(getQuestionSpan(2)).toBeInTheDocument();
  await user.click(firstQuesBtn);
  expect(getState()).toMatchObject({ index: 0, direction: -1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
});

test('When click Submit', async () => {
  useMainStore.setState({
    picked: [
      fakeQuiz[0].correct_answer,
      fakeQuiz[1].correct_answer,
      fakeQuiz[2].correct_answer,
    ],
  });

  const submitBtn = screen.getByRole('button', { name: /Submit/i });
  await user.click(submitBtn);
  // State: result is not null
  expect(getState().result).not.toBeNull();
  // Result screen is rendered
  expect(await screen.findByTestId(/Result/i)).toBeInTheDocument();
});

test('When click Cancel quiz', async () => {
  const cancelBtn = screen.getByRole('button', { name: 'Cancel quiz' });
  await user.click(cancelBtn);
  const confirmBtn = screen.getByRole('button', { name: 'Quit' });
  await user.click(confirmBtn);

  // State: is reset
  expect(getState()).toMatchObject({
    quiz: null,
    quizErrMsg: null,
    index: 0,
    direction: 1,
    picked: null,
    result: null,
  });

  // Home is rendered
  expect(await screen.findByTestId(/Home/i)).toBeInTheDocument();
});
