import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import { dataSchema } from '../types/schemas';
import Home from './Home';

vi.mock('../api');
const mockFetchQuiz = vi.mocked(fetchQuiz);

afterEach(() => {
  cleanup();
  vi.mocked(fetchQuiz).mockClear();
});

test('Valid questionCount', async () => {
  render(<Home />);

  const getQuestionCountInput = () =>
    screen.getByLabelText<HTMLInputElement>('Number of questions');

  fireEvent.change(getQuestionCountInput(), { target: { value: '20' } });
  expect(getQuestionCountInput()).toHaveAttribute('value', '20');
});

test('If invalid questionCount, fetchQuiz should not be called', async () => {
  render(<Home />);

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
  render(<Home />);

  mockFetchQuiz.mockResolvedValueOnce({
    response_code: 0,
    results: [
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
    ],
  });

  const submitBtn = screen.getByText('Submit');
  fireEvent.submit(submitBtn);
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

  await waitFor(() =>
    expect(fetchQuiz).toBeCalledWith('https://opentdb.com/api.php?amount=5'),
  );

  await waitFor(() =>
    expect(mockFetchQuiz.mock.results[0].type).toEqual('return'),
  );
});

test('If invalid/empty URL, should see error message', async () => {
  render(<Home />);

  mockFetchQuiz.mockImplementationOnce(async () => {
    const fetchedData = {
      response_code: 2,
      results: [],
    };

    const validData = dataSchema.parse(fetchedData);

    return validData;
  });

  const submitBtn = screen.getByText('Submit');
  fireEvent.submit(submitBtn);
  const getSubmitErrMsg = () => screen.getByTestId('submit-error-message');

  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

  await waitFor(() =>
    expect(mockFetchQuiz.mock.results[0].type).toEqual('throw'),
  );

  expect(getSubmitErrMsg()).toHaveTextContent(/validation error/gi);
});
