import randomize from './randomize';

/**
 * @returns an array of 4 answer objects whose orders are randomized.
 */
export default function shuffleAnswers(
  correct_answer: string,
  incorrect_answers: string[],
) {
  const answers = [correct_answer, ...incorrect_answers];
  const shuffled: string[] = Array(answers.length).fill('');

  for (let index = 0; index < answers.length; index++) {
    const avaiIndexes = shuffled
      .map((value, i) => (value !== '' ? value : i))
      .filter((value) => typeof value === 'number') as number[];

    const target = answers[index];
    const randomIndex = randomize(avaiIndexes);
    shuffled[randomIndex] = target;
  }

  return shuffled;
}
