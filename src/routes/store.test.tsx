import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, test, vi } from 'vitest';

import fetchQuiz from '../api';
import { quizFactory } from '../utils/factory';
import useMainStore from '../zustand/useMainStore';
import routes from '.';

const user = userEvent.setup();
vi.mock('../api');
const fakeQuiz = quizFactory(3);
vi.mocked(fetchQuiz).mockResolvedValue(fakeQuiz);

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
}

describe('QuizSlice', () => {
  test('is initialized correctly', async () => {
    await renderQuiz();
    expect(useMainStore.getState().quiz).toStrictEqual(fakeQuiz);
  });

  test('is reset when click cancel button', async () => {
    await renderQuiz();
    const cancelBtn = screen.getByRole('button', { name: 'Cancel quiz' });
    await user.click(cancelBtn);

    expect(useMainStore.getState()).toMatchObject({
      quiz: null,
      quizErrMsg: null,
      index: 0,
      direction: 1,
      picked: null,
      result: null,
    });
  });
});

describe('ActiveQuestionSlice', () => {
  test('update index and direction when click Next and Prev', async () => {
    await renderQuiz();
    const prevBtn = await screen.findByRole('button', { name: /Previous/i });
    const nextBtn = await screen.findByRole('button', { name: /Next/i });

    expect(useMainStore.getState()).toMatchObject({ index: 0, direction: 1 });
    await user.click(nextBtn);
    expect(useMainStore.getState()).toMatchObject({ index: 1, direction: 1 });
    await user.click(prevBtn);
    expect(useMainStore.getState()).toMatchObject({ index: 0, direction: -1 });
  });

  test("update index and direction when click one of progress bar's button", async () => {
    await renderQuiz();
    const firstQuesBtn = screen.getByRole('button', { name: /1st/ });
    const thirdQuesBtn = screen.getByRole('button', { name: /3rd/ });
    await user.click(thirdQuesBtn);
    expect(useMainStore.getState()).toMatchObject({ index: 2, direction: 1 });
    await user.click(firstQuesBtn);
    expect(useMainStore.getState()).toMatchObject({ index: 0, direction: -1 });
  });
});

describe('PickedSlice', () => {
  test('is initialized correctly', async () => {
    await renderQuiz();

    expect(useMainStore.getState()).toMatchObject({
      picked: [undefined, undefined, undefined],
    });
  });

  test('update correctly after click an AnswerRadio', async () => {
    await renderQuiz();

    const answer1 = fakeQuiz[0].answers[0];
    const radio1 = screen.getByRole('radio', { name: answer1 });
    await user.click(radio1);

    expect(useMainStore.getState()).toMatchObject({
      picked: [answer1, undefined, undefined],
    });
  });

  test('does not contain any undefined item after submit', async () => {
    await renderQuiz();
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    const submitBtn = await screen.findByRole('button', { name: /Submit/i });

    const getRadio = (i: number) =>
      screen.getByRole('radio', { name: fakeQuiz[i].answers[0] });

    await user.click(getRadio(0));
    await user.click(nextBtn);
    await user.click(getRadio(1));
    await user.click(nextBtn);
    await user.click(getRadio(2));
    await user.click(nextBtn);
    await user.click(submitBtn);

    expect(useMainStore.getState().picked).not.toContain(undefined);
  });
});

describe('ResultSlice', () => {
  test('is initialized as null', async () => {
    await renderQuiz();
    expect(useMainStore.getState().result).toBeNull();
  });

  test('is updated after submit', async () => {
    await renderQuiz();
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    const submitBtn = await screen.findByRole('button', { name: /Submit/i });

    const getRadio = (i: number) =>
      screen.getByRole('radio', { name: fakeQuiz[i].answers[0] });

    await user.click(getRadio(0));
    await user.click(nextBtn);
    await user.click(getRadio(1));
    await user.click(nextBtn);
    await user.click(getRadio(2));
    await user.click(nextBtn);
    await user.click(submitBtn);

    expect(useMainStore.getState().result).toMatchObject({
      correctMap: expect.any(Array),
      correctCount: expect.any(Number),
      percentage: expect.any(Number),
      msgs: expect.objectContaining({
        main: expect.any(String),
        sub: expect.any(String),
      }),
    });
  });

  test('is reset after going home', async () => {
    await renderQuiz();
    const nextBtn = await screen.findByRole('button', { name: /Next/i });

    const getRadio = (i: number) =>
      screen.getByRole('radio', { name: fakeQuiz[i].answers[0] });

    await user.click(getRadio(0));
    await user.click(nextBtn);
    await user.click(getRadio(1));
    await user.click(nextBtn);
    await user.click(getRadio(2));
    await user.click(nextBtn);
    await user.click(await screen.findByRole('button', { name: /Submit/i }));
    await user.click(await screen.findByRole('button', { name: /Go Home/i }));
    expect(useMainStore.getState().result).toBeNull();
  });
});
