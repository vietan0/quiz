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
import { dataSchema } from '../types/schemas';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Quiz from './Quiz';
import Result from './Result';

vi.mock('../api');
const mockFetchQuiz = vi.mocked(fetchQuiz);

afterEach(() => {
  cleanup();
  vi.mocked(fetchQuiz).mockClear();
});

function customRender() {
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
}

test('Valid questionCount', async () => {
  customRender();

  const getQuestionCountInput = () =>
    screen.getByLabelText<HTMLInputElement>('Number of questions');

  fireEvent.change(getQuestionCountInput(), { target: { value: '20' } });
  expect(getQuestionCountInput()).toHaveAttribute('value', '20');
});

test('If invalid questionCount, fetchQuiz should not be called', async () => {
  customRender();

  const getQuestionCountInput = () =>
    screen.getByLabelText<HTMLInputElement>('Number of questions');

  fireEvent.change(getQuestionCountInput(), { target: { value: '0' } });
  const errMsg = await screen.findByText(/must be greater/);
  expect(getQuestionCountInput()).toHaveAttribute('value', '0');
  expect(errMsg).toBeInTheDocument();
  expect(errMsg).toHaveAttribute('data-slot', 'error-message');
  expect(mockFetchQuiz).not.toBeCalled();
});

test('fetchQuiz is called when click submit button', async () => {
  customRender();

  mockFetchQuiz.mockResolvedValueOnce([
    {
      type: 'multiple',
      difficulty: 'medium',
      category: 'Entertainment: Film',
      question:
        'What is the make and model of the tour vehicles in &quot;Jurassic Park&quot; (1993)?',
      correct_answer: '1992 Ford Explorer XLT',
      incorrect_answers: [
        '1992 Toyota Land Cruiser',
        '1992 Jeep Wrangler YJ Sahar',
        'Mercedes M-Class',
      ],
    },
  ]);

  const submitBtn = screen.getByText('Submit');
  fireEvent.submit(submitBtn);
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

  await waitFor(() =>
    expect(fetchQuiz).toBeCalledWith(
      'https://opentdb.com/api.php?type=multiple&amount=5',
    ),
  );

  await waitFor(() =>
    expect(mockFetchQuiz.mock.results[0].type).toEqual('return'),
  );
});

test('If invalid/empty URL, should see error message', async () => {
  customRender();

  mockFetchQuiz.mockImplementationOnce(async () => {
    const fetchedData = {
      response_code: 2,
      results: [],
    };

    const validData = dataSchema.parse(fetchedData);

    return validData.results;
  });

  const submitBtn = screen.getByText('Submit');
  fireEvent.submit(submitBtn);
  const getErrorMsg = () => screen.getByTestId('errorMsg');

  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

  await waitFor(() =>
    expect(mockFetchQuiz.mock.results[0].type).toEqual('throw'),
  );

  expect(getErrorMsg()).toHaveTextContent(/validation error/gi);
});
