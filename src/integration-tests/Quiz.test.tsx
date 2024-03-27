import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import routes from '../routes';
import { quizFactory } from '../utils/factory';
import useMainStore from '../zustand/useMainStore';

const user = userEvent.setup();
vi.mock('../api');
const fakeQuiz = quizFactory(3);
const mockFetchQuiz = vi.mocked(fetchQuiz);
mockFetchQuiz.mockResolvedValue(fakeQuiz);
const { getState } = useMainStore;

async function renderQuiz() {
  const testRouter = createMemoryRouter(routes);
  render(<RouterProvider router={testRouter} />);
  const startBtn = screen.getByText(/Start/);
  await user.click(startBtn);
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));
}

beforeEach(async () => {
  await renderQuiz();
});

afterEach(() => {
  cleanup();
  mockFetchQuiz.mockClear();
});

test('When quiz starts', async () => {
  // state: active question, picked and result are initialized
  expect(getState()).toMatchObject({
    index: 0,
    direction: 1,
    picked: [undefined, undefined, undefined],
  });

  // Previous & Submit button is disabled at index 0
  const prevBtn = await screen.findByRole('button', { name: /Previous/i });
  const submitBtn = await screen.findByRole('button', { name: /Submit/i });
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
  const prevBtn = await screen.findByRole('button', { name: /Previous/i });
  const nextBtn = await screen.findByRole('button', { name: /Next/i });
  const getQuestionSpan = (i: number) => screen.getByText(fakeQuiz[i].question);
  // State: index, direction is updated
  // The correct question is rendered
  expect(getState()).toMatchObject({ index: 0, direction: 1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
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
  // setup
  const nextBtn = await screen.findByRole('button', { name: /Next/i });

  const submitBtn = await screen.findByRole('button', {
    name: /Submit/i,
  });

  const getRadio = (i: number) =>
    screen.getByRole('radio', { name: fakeQuiz[i].answers[0] });

  await user.click(getRadio(0));
  await user.click(nextBtn);
  await user.click(getRadio(1));
  await user.click(nextBtn);
  await user.click(getRadio(2));
  await user.click(nextBtn);
  await user.click(submitBtn);

  // State: picked doesn't contain any undefined item
  expect(getState().picked).not.toContain(undefined);
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
