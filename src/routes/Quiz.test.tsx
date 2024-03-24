import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import useMainStore from '../useMainStore';
import { quizFactory } from '../utils/factory';
import routes from '.';

vi.mock('../api');
const mockFetchQuiz = vi.mocked(fetchQuiz);
const fakeQuiz = quizFactory(2);
mockFetchQuiz.mockResolvedValue(fakeQuiz);

afterEach(() => {
  cleanup();
  vi.mocked(fetchQuiz).mockClear();
});

async function renderQuiz() {
  const testRouter = createMemoryRouter(routes);
  render(<RouterProvider router={testRouter} />);

  const submitBtn = screen.getByText('Submit');
  fireEvent.submit(submitBtn);
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

  expect(screen.getByTestId('motion.div')).toHaveAttribute(
    'style',
    expect.stringMatching(/opacity: 1/),
  ); // confirm that animation is disabled

  // get buttons
  const prevBtn = await screen.findByRole('button', { name: /Previous/i });
  const nextBtn = await screen.findByRole('button', { name: /Next/i });
  // get question span
  const getQuestionSpan = (i: number) => screen.getByText(fakeQuiz[i].question);

  return { prevBtn, nextBtn, getQuestionSpan };
}

test('Previous button should be disabled at index 0', async () => {
  const { prevBtn } = await renderQuiz();
  expect(prevBtn).toBeDisabled();
});

test('Click Next should go to next question', async () => {
  const { nextBtn, getQuestionSpan } = await renderQuiz();
  expect(useMainStore.getState()).toMatchObject({ index: 0, direction: 1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
  fireEvent.click(nextBtn);
  expect(useMainStore.getState()).toMatchObject({ index: 1, direction: 1 });
  expect(getQuestionSpan(1)).toBeInTheDocument();
});

test('Answers order should be intact after navigating a few times', async () => {
  const correctIndex = fakeQuiz[0].answers.findIndex((a) => a.correct);
  const { prevBtn, nextBtn } = await renderQuiz();
  fireEvent.click(nextBtn);
  fireEvent.click(prevBtn);
  expect(fakeQuiz[0].answers.findIndex((a) => a.correct)).toBe(correctIndex);
  // in other words, quizFactory/questionFactory/shuffleAnswers should not be called again
});
