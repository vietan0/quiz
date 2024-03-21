import { Link } from 'react-router-dom';

import QuestionScreen from '../components/QuestionScreen';
import useStore from '../useStore';

export default function Quiz() {
  const { quiz, errorMsg, resetState, index, moveIndex } = useStore((s) => s);

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
    <div id="Quiz" className="h-full">
      {errorMsg ? (
        errMsgDiv
      ) : quiz ? (
        <>
          <div id="progress-bar" className="sticky top-0 border px-4 py-8">
            Question {index + 1} of {quiz.length}
          </div>
          <QuestionScreen q={quiz[index]} key={index} />
          <div className="sticky bottom-0 border px-4 py-8">
            <button onClick={() => moveIndex(-1)}>Previous</button>
            <button onClick={() => moveIndex(1)}>Next</button>
          </div>
        </>
      ) : (
        'Preparing some questions...'
      )}
    </div>
  );
}
