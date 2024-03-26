import { Button } from '@nextui-org/button';
import { useNavigate } from 'react-router-dom';

import useMainStore from '../zustand/useMainStore';

export default function Result() {
  const result = useMainStore((state) => state.result);
  const quiz = useMainStore((state) => state.quiz);
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const navigate = useNavigate();

  return (
    <div
      data-testid="Result"
      className="flex min-h-screen flex-grow flex-col justify-center gap-10 px-4 py-16 text-center xs:px-8 sm:px-24 lg:px-48"
    >
      {result && (
        <>
          <div>
            <p className="text-3xl font-bold">{result.msgs.main}</p>
            <p className="text-lg">{result.msgs.sub}</p>
          </div>
          <div>
            <p className="text-xl font-bold">{result.percentage}%</p>
            <p>
              You got {result.correctCount} / {quiz!.length} questions right.
            </p>
          </div>
        </>
      )}
      <div className="flex justify-center gap-8">
        <Button
          size="lg"
          color="primary"
          variant="ghost"
          className="w-40 font-bold"
          onClick={() => {
            navigate('/quiz');
          }}
        >
          Review Lesson
        </Button>
        <Button
          onPress={() => {
            resetQuiz();
            navigate('/');
          }}
          size="lg"
          variant="ghost"
          color="success"
          className="w-40 font-bold"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
