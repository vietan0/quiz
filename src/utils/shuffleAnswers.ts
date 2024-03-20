import randomize from './randomize';

type Answer = {
  text: string;
  correct: boolean;
};

function craftAnswerObjects(
  correct_answer: string,
  incorrect_answers: string[],
): Answer[] {
  return [
    { text: correct_answer, correct: true },
    ...incorrect_answers.map((text) => ({ text, correct: false })),
  ];
}

/**
 * @returns an array of 4 answer objects whose orders are randomized.
 */
export default function shuffleAnswers(
  correct_answer: string,
  incorrect_answers: string[],
) {
  const answers = craftAnswerObjects(correct_answer, incorrect_answers);
  const shuffled = Array(answers.length).fill('') as Array<Answer | ''>;

  for (let index = 0; index < answers.length; index++) {
    const avaiIndexes = shuffled
      .map((value, i) => (value !== '' ? value : i))
      .filter((value) => typeof value !== 'object') as unknown as number[];

    const target = answers[index];
    const randomIndex = randomize(avaiIndexes);
    shuffled[randomIndex] = target;
  }

  return shuffled as Answer[];
}
