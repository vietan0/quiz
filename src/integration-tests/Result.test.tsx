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
});

afterEach(() => {
  cleanup();
  mockFetchQuiz.mockClear();
});

test('When click Review', async () => {
  const reviewBtn = screen.getByText(/Review/i);
  await user.click(reviewBtn);
  // state is not reset
  expect(getState().quiz).not.toBeNull();
  // nav buttons are rendered
  expect(await screen.findByText(/Next/)).toBeInTheDocument();
});

test('When click Play Again', async () => {
  const playAgainBtn = screen.getByText(/Play Again/i);
  await user.click(playAgainBtn);

  // state is reset
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
