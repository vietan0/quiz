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
import App from '../App';
import useStore from '../useStore';
import { quizFactory } from '../utils/factory';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Quiz from './Quiz';
import Result from './Result';

vi.mock('../api');
const mockFetchQuiz = vi.mocked(fetchQuiz);
const fakeQuiz = quizFactory(2);
mockFetchQuiz.mockResolvedValue(fakeQuiz);

afterEach(() => {
  cleanup();
  vi.mocked(fetchQuiz).mockClear();
});

async function renderQuiz() {
  const routes = [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: '/quiz', element: <Quiz /> },
        { path: '/result', element: <Result /> },
      ],
    },
  ];

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

test('Click Previous when at first question should not do anything', async () => {
  const { prevBtn, getQuestionSpan } = await renderQuiz();
  expect(useStore.getState()).toMatchObject({ index: 0, direction: 1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
  fireEvent.click(prevBtn);
  expect(useStore.getState()).toMatchObject({ index: 0, direction: -1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
});

test('Click Next should go to next question', async () => {
  const { nextBtn, getQuestionSpan } = await renderQuiz();
  expect(useStore.getState()).toMatchObject({ index: 0, direction: 1 });
  expect(getQuestionSpan(0)).toBeInTheDocument();
  fireEvent.click(nextBtn);
  expect(useStore.getState()).toMatchObject({ index: 1, direction: 1 });
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
