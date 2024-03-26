import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import { dataSchema } from '../types/schemas';
import { quizFactory } from '../utils/factory';
import shuffleAnswers from '../utils/shuffleAnswers';
import routes from '.';

const user = userEvent.setup();
vi.mock('../api');
const mockFetchQuiz = vi.mocked(fetchQuiz);

function renderHome() {
  const testRouter = createMemoryRouter(routes);
  render(<RouterProvider router={testRouter} />);
}

beforeEach(renderHome);

afterEach(() => {
  cleanup();
  vi.mocked(fetchQuiz).mockClear();
});

describe('When change questionCount input', () => {
  const getInput = () =>
    screen.getByLabelText<HTMLInputElement>('Number of questions');

  test('update attribute correctly when valid', async () => {
    fireEvent.change(getInput(), { target: { value: '20' } });
    expect(getInput()).toHaveAttribute('value', '20');
  });

  test('show error message when invalid', async () => {
    fireEvent.change(getInput(), { target: { value: '0' } });
    const errMsg = await screen.findByText(/must be greater/);
    expect(errMsg).toHaveAttribute('data-slot', 'error-message');
  });
});

describe('When click Submit', () => {
  test('fetchQuiz returns data when URL is valid', async () => {
    mockFetchQuiz.mockResolvedValueOnce(quizFactory(1));
    await user.click(screen.getByText('Submit'));
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

  test('fetchQuiz throws and error is displayed when URL is empty/invalid', async () => {
    mockFetchQuiz.mockImplementationOnce(async () => {
      const fetchedData = { response_code: 2, results: [] };
      const validData = dataSchema.parse(fetchedData);

      const quiz = validData.results.map((question) => {
        const { correct_answer, incorrect_answers } = question;
        const answers = shuffleAnswers(correct_answer, incorrect_answers);

        return { ...question, answers };
      });

      return quiz;
    });

    const submitBtn = screen.getByText('Submit');
    await user.click(submitBtn);
    await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));

    await waitFor(() =>
      expect(mockFetchQuiz.mock.results[0].type).toEqual('throw'),
    );

    expect(screen.getByTestId('quizErrMsg')).toHaveTextContent(
      /validation error/gi,
    );
  });
});
