import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import routes from '../routes';
import Quiz from '../routes/Quiz';
import { quizFactory } from '../utils/factory';

const user = userEvent.setup();
vi.mock('../api');
const fakeQuiz = quizFactory(3);
const mockFetchQuiz = vi.mocked(fetchQuiz);
mockFetchQuiz.mockResolvedValue(fakeQuiz);

const wrongRoutes = [...routes];
wrongRoutes[0].children[1] = { path: '/wrong-path', element: <Quiz /> };

test('ErrorPage is rendered when path not recognized', async () => {
  const falseRouter = createMemoryRouter(wrongRoutes);
  render(<RouterProvider router={falseRouter} />);
  await user.click(screen.getByText('Start'));
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));
  expect(await screen.findByTestId('ErrorPage')).toBeInTheDocument();
});
