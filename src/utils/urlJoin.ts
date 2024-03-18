import { categories } from '../types/api-data';
import { Form, urlSchema } from '../types/schemas';

export default function urlJoin(data: Form) {
  const { questionCount, difficulty, category } = data;
  const questionCountQuery = `&amount=${questionCount}`;

  const difficultyQuery =
    difficulty === 'any' ? '' : `&difficulty=${difficulty}`;

  const categoryQuery =
    category === 'Any Category' ? '' : `&category=${categories[category]}`;

  const url = `https://opentdb.com/api.php?type=multiple${questionCountQuery}${difficultyQuery}${categoryQuery}`;
  const validUrl = urlSchema.parse(url);

  return validUrl;
}
