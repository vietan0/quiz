import { openTriviaResponses, responseCodesMap } from '../types/api-data';
import { Data } from '../types/schemas';

export default function openTriviaErrorHandling(
  data: Data,
  setData: React.Dispatch<React.SetStateAction<Data>>,
) {
  const receivedCode = data.response_code;

  if (receivedCode === 0) {
    setData(data);
  } else {
    // receivedCode is 1, 2, 3, 4, 5
    const response = openTriviaResponses.find(
      (key) => responseCodesMap[key] === receivedCode,
    );

    console.log(response);
  }
}
