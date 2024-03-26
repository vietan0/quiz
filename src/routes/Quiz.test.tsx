import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import { quizFactory } from '../utils/factory';
import routes from '.';

const user = userEvent.setup();
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
  await user.click(submitBtn);
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
  expect(getQuestionSpan(0)).toBeInTheDocument();
  await user.click(nextBtn);
  expect(getQuestionSpan(1)).toBeInTheDocument();
});

test('Answers order should be intact after navigating a few times', async () => {
  const originAnswer = fakeQuiz[0].answers[0];
  const { prevBtn, nextBtn } = await renderQuiz();
  await user.click(nextBtn);
  await user.click(prevBtn);
  expect(fakeQuiz[0].answers[0]).toBe(originAnswer);
  // in other words, quizFactory/questionFactory/shuffleAnswers should not be called again
});
