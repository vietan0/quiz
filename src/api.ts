import { Data, dataSchema } from './types/schemas';

export default async function fetchQuiz(validUrl: string): Promise<Data> {
  const fetchedData = await fetch(validUrl).then((res) => res.json());
  const validData = dataSchema.parse(fetchedData);

  return validData;
}
