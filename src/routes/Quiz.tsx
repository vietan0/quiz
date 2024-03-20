import { Link } from 'react-router-dom';

import QuestionScreen from '../components/QuestionScreen';
import useQuizStore from '../quizStore';
import { Question } from '../types/schemas';

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
    <div id="Quiz">
      <h1 className="mx-10">Quiz</h1>
      {errorMsg
        ? errMsgDiv
        : quiz
          ? quiz.map((q: Question, i) => (
              <QuestionScreen q={q} index={i} key={i} />
            ))
          : 'Preparing some questions...'}
    </div>
  );
}
