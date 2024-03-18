import { Link } from 'react-router-dom';

import useQuizStore from '../quizStore';

export default function Quiz() {
  const { quiz, errorMsg, resetState } = useQuizStore(
    ({ quiz, errorMsg, resetState }) => ({ quiz, errorMsg, resetState }),
  );

  const errMsgDiv = (
    <div>
      <p>There has been an error while getting quiz:</p>
      <pre className="text-sm text-red-500" data-testid="errorMsg">
        {errorMsg}
      </pre>
      <Link to="/" className="underline" onClick={resetState}>
        Go Home
      </Link>
    </div>
  );

  return (
    <div>
      <h1>Quiz</h1>
      {errorMsg ? (
        errMsgDiv
      ) : quiz ? (
        <pre>{JSON.stringify(quiz, null, 2)}</pre>
      ) : (
        'Loading...'
      )}
    </div>
  );
}
