import { Button } from '@nextui-org/button';
import { CircularProgress } from '@nextui-org/progress';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useMainStore from '../zustand/useMainStore';

export default function Result() {
  const result = useMainStore((state) => state.result);
  const quiz = useMainStore((state) => state.quiz);
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz === null) navigate('/');
  }, [quiz, navigate]);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      data-testid="Result"
      className="flex min-h-screen flex-grow flex-col justify-center gap-10 px-4 py-16 text-center xs:px-8 sm:px-24 lg:px-60"
    >
      {result && (
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="flex-1">
            <p className="text-4xl font-bold">{result.msgs.main}</p>
            <p className="text-lg">{result.msgs.sub}</p>
          </div>
          <CircularProgress
            aria-label="Loading..."
            size="lg"
            value={result.percentage}
            showValueLabel={true}
            label={`You got ${result.correctCount} / ${quiz!.length} questions right.`}
            classNames={{
              base: 'max-w-none flex-1',
              svg: 'h-40 w-40',
              value: 'text-4xl font-bold text-primary',
            }}
          />
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
        <Button
          size="lg"
          color="primary"
          variant="ghost"
          className="flex-grow font-bold sm:flex-1"
          onClick={() => {
            navigate('/quiz');
          }}
        >
          Review Your Answers
        </Button>
        <Button
          onPress={() => {
            resetQuiz();
            navigate('/');
          }}
          size="lg"
          variant="ghost"
          color="success"
          className="flex-grow font-bold sm:flex-1"
        >
          Play Again
        </Button>
      </div>
    </motion.div>
  );
}
