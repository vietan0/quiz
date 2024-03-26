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

import fetchQuiz from './api';
import routes from './routes';
import { dataSchema } from './types/schemas';
import { quizFactory } from './utils/factory';
import shuffleAnswers from './utils/shuffleAnswers';
import useMainStore from './zustand/useMainStore';

const user = userEvent.setup();
vi.mock('./api');
const fakeQuiz = quizFactory(3);
const mockFetchQuiz = vi.mocked(fetchQuiz);

mockFetchQuiz.mockResolvedValue(fakeQuiz);
const { getState } = useMainStore;

afterEach(() => {
  cleanup();
  mockFetchQuiz.mockClear();
});

async function renderQuiz() {
  const testRouter = createMemoryRouter(routes);
  render(<RouterProvider router={testRouter} />);
  const submitBtn = screen.getByText('Submit');
  await user.click(submitBtn);
  await waitFor(() => expect(fetchQuiz).toBeCalledTimes(1));
}

describe('When in Home', () => {
  function renderHome() {
    const testRouter = createMemoryRouter(routes);
    render(<RouterProvider router={testRouter} />);
  }

  beforeEach(() => {
    renderHome();
  });

  test('state is initialized', () => {
    expect(getState()).toMatchObject({
      quiz: null,
      quizErrMsg: null,
      index: 0,
      direction: 1,
      picked: null,
      result: null,
    });
  });

  describe('Form', () => {
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
  });
});

describe('When in Quiz', () => {
  beforeEach(async () => {
    await renderQuiz();
  });

  describe('When quiz starts', () => {
    test('State: active question, picked and result are initialized', () => {
      expect(getState()).toMatchObject({
        index: 0,
        direction: 1,
        picked: [undefined, undefined, undefined],
      });
    });

    test('Previous & Submit button is disabled at index 0', async () => {
      const prevBtn = await screen.findByRole('button', { name: /Previous/i });
      const submitBtn = await screen.findByRole('button', { name: /Submit/i });
      expect(prevBtn).toBeDisabled();
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('When pick an answer', () => {
    test('State: picked is updated', async () => {
      const answer1 = fakeQuiz[0].answers[0];
      const radio1 = screen.getByRole('radio', { name: answer1 });
      await user.click(radio1);

      expect(getState()).toMatchObject({
        picked: [answer1, undefined, undefined],
      });
    });

    test("Progress/QuizStatus button's data-status is updated", async () => {
      const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
      const answer1 = fakeQuiz[0].answers[0];
      const radio1 = screen.getByRole('radio', { name: answer1 });
      expect(firstQuesBtn).toHaveAttribute('data-status', 'not-picked');
      await user.click(radio1);
      expect(firstQuesBtn).toHaveAttribute('data-status', 'picked');
    });
  });

  describe('When click Next/Prev', async () => {
    test('State: index, direction is updated', async () => {
      const prevBtn = await screen.findByRole('button', { name: /Previous/i });
      const nextBtn = await screen.findByRole('button', { name: /Next/i });
      expect(getState()).toMatchObject({ index: 0, direction: 1 });
      await user.click(nextBtn);
      expect(getState()).toMatchObject({ index: 1, direction: 1 });
      await user.click(prevBtn);
      expect(getState()).toMatchObject({ index: 0, direction: -1 });
    });

    test('The correct question is rendered', async () => {
      const prevBtn = await screen.findByRole('button', { name: /Previous/i });
      const nextBtn = await screen.findByRole('button', { name: /Next/i });

      const getQuestionSpan = (i: number) =>
        screen.getByText(fakeQuiz[i].question);

      expect(getQuestionSpan(0)).toBeInTheDocument();
      await user.click(nextBtn);
      expect(getQuestionSpan(1)).toBeInTheDocument();
      await user.click(prevBtn);
      expect(getQuestionSpan(0)).toBeInTheDocument();
    });
  });

  describe('When click a Progress/QuizStatus button', () => {
    test('State: index, direction is updated', async () => {
      const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
      const thirdQuesBtn = screen.getByRole('button', { name: /3rd/ });
      await user.click(thirdQuesBtn);
      expect(getState()).toMatchObject({ index: 2, direction: 1 });
      await user.click(firstQuesBtn);
      expect(getState()).toMatchObject({ index: 0, direction: -1 });
    });

    test('The right question is rendered', async () => {
      const getQuestionSpan = (i: number) =>
        screen.getByText(fakeQuiz[i].question);

      const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
      const thirdQuesBtn = screen.getByRole('button', { name: /3rd/ });
      await user.click(thirdQuesBtn);
      expect(getQuestionSpan(2)).toBeInTheDocument();
      await user.click(firstQuesBtn);
      expect(getQuestionSpan(0)).toBeInTheDocument();
    });
  });

  describe('When click Submit', () => {
    beforeEach(async () => {
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

    test("State: picked doesn't contain any undefined item", () => {
      expect(useMainStore.getState().picked).not.toContain(undefined);
    });

    test('State: result is not null', () => {
      expect(useMainStore.getState().result).not.toBeNull();
    });

    test('Result screen is rendered', async () => {
      expect(await screen.findByTestId(/Result/i)).toBeInTheDocument();
    });
  });

  describe('When click Cancel quiz', () => {
    test('State: is reset', async () => {
      const cancelBtn = screen.getByRole('button', { name: 'Cancel quiz' });
      await user.click(cancelBtn);

      expect(getState()).toMatchObject({
        quiz: null,
        quizErrMsg: null,
        index: 0,
        direction: 1,
        picked: null,
        result: null,
      });
    });

    test('Home is rendered', async () => {
      const cancelBtn = screen.getByRole('button', { name: 'Cancel quiz' });
      await user.click(cancelBtn);
      expect(await screen.findByTestId(/Home/i)).toBeInTheDocument();
    });
  });
});

describe('When in Result', () => {
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

  describe('When click Review', () => {
    test('State: is not reset', async () => {
      const reviewBtn = screen.getByText(/Review/i);
      await user.click(reviewBtn);
      expect(getState().quiz).not.toBeNull();
    });

    test('Navigation buttons is rendered', async () => {
      const reviewBtn = screen.getByText(/Review/i);
      await user.click(reviewBtn);
      expect(await screen.findByText(/Next/)).toBeInTheDocument();
    });
  });

  describe('When click Go Home', () => {
    test('State: is reset', async () => {
      const goHomeBtn = screen.getByText(/Go Home/i);
      await user.click(goHomeBtn);

      expect(getState()).toMatchObject({
        quiz: null,
        quizErrMsg: null,
        index: 0,
        direction: 1,
        picked: null,
        result: null,
      });
    });

    test('Home is rendered', async () => {
      const goHomeBtn = screen.getByText(/Go Home/i);
      await user.click(goHomeBtn);
      expect(await screen.findByTestId(/Home/i)).toBeInTheDocument();
    });
  });
});
