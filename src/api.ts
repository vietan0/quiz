import { dataSchema, Quiz } from './types/schemas';
import shuffleAnswers from './utils/shuffleAnswers';

export default async function fetchQuiz(validUrl: string): Promise<Quiz> {
  const fetchedData = await fetch(validUrl).then((res) => res.json());
  const validData = dataSchema.parse(fetchedData);

  const quiz = validData.results.map((question) => {
    const { correct_answer, incorrect_answers } = question;
    const answers = shuffleAnswers(correct_answer, incorrect_answers);

    return { ...question, answers };
  });

  return quiz;
}
