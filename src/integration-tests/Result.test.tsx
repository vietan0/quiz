import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, expect, test } from 'vitest';

import routes from '../routes';
import { quizFactory } from '../utils/factory';
import useMainStore from '../zustand/useMainStore';

const user = userEvent.setup();

function mockState() {
  const fakeQuiz = quizFactory(2);

  const fakePicked = [
    fakeQuiz[0].correct_answer,
    fakeQuiz[1].incorrect_answers[0],
  ];

  useMainStore.setState({
    quiz: fakeQuiz,
    picked: fakePicked,
    result: {
      correctMap: [true, false],
      correctCount: 1,
      percentage: 50,
      msgs: { main: '👍 Good!', sub: 'Could be improved.' },
    },
  });
}

async function renderResult() {
  const testRouter = createMemoryRouter(routes, {
    initialEntries: ['/result'],
  });

  mockState();
  render(<RouterProvider router={testRouter} />);
}

beforeEach(renderResult);
afterEach(cleanup);

test('When click Review', async () => {
  const reviewBtn = screen.getByText(/Review/i);
  await user.click(reviewBtn);
  // state is not reset
  expect(useMainStore.getState().quiz).not.toBeNull();
  // nav buttons are rendered
  expect(await screen.findByText(/Next/)).toBeInTheDocument();
});

test('When click Play Again', async () => {
  const playAgainBtn = screen.getByText(/Play Again/i);
  await user.click(playAgainBtn);

  // state is reset
  expect(useMainStore.getState()).toMatchObject({
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
