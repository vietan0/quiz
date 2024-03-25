import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, ButtonGroup } from '@nextui-org/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import Progress from '../components/Progress';
import QuestionScreen from '../components/QuestionScreen';
import useMainStore from '../zustand/useMainStore';

export default function Quiz() {
  const {
    quiz,
    quizErrMsg,
    resetQuiz,
    index,
    direction,
    moveIndex,
    picked,
    result,
    setResult,
  } = useMainStore();

  const navigate = useNavigate();

  const variants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? 60 : -60,
      opacity: 0,
    }),
    stay: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? -60 : 60,
      opacity: 0,
    }),
  };

  const errMsgDiv = (
    <div>
      <p>There has been an error while getting quiz:</p>
      <pre className="text-sm text-red-500" data-testid="quizErrMsg">
        {quizErrMsg}
      </pre>
      <Link to="/" className="underline" onClick={resetQuiz}>
        Go Home
      </Link>
    </div>
  );

  function checkAnswers() {
    const result = picked!.map((pick, i) => pick === quiz![i].correct_answer);
    setResult(result);
  }

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {quizErrMsg ? (
        errMsgDiv
      ) : quiz ? (
        <>
          <Progress />
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={index}
              variants={variants}
              custom={direction}
              initial="enter"
              animate="stay"
              exit="exit"
              transition={{ type: 'tween' }}
              data-testid="motion.div"
            >
              <QuestionScreen q={quiz![index]} index={index} key={index} />
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between border-t px-4 py-8 xs:px-8 sm:px-16 lg:px-32">
            <ButtonGroup radius="md">
              <Button
                variant="ghost"
                size="lg"
                className="w-40"
                isDisabled={index === 0}
                onPress={() => moveIndex(-1)}
                startContent={
                  <Icon
                    icon="material-symbols:arrow-left-alt-rounded"
                    width={24}
                    height={24}
                  />
                }
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-40"
                isDisabled={index === quiz.length - 1}
                onPress={() => moveIndex(1)}
                endContent={
                  <Icon
                    icon="material-symbols:arrow-right-alt-rounded"
                    width={24}
                    height={24}
                  />
                }
              >
                Next
              </Button>
            </ButtonGroup>
            <Button
              size="lg"
              isDisabled={picked!.filter((n) => n === undefined).length !== 0}
              className="w-40 bg-success-400 font-bold text-white"
              onPress={() => {
                if (result) {
                  console.log('quiz already done');
                } else {
                  navigate('/result');
                  checkAnswers();
                }
              }}
            >
              {result ? 'Go To Result' : 'Submit'}
            </Button>
          </div>
        </>
      ) : (
        'Preparing some questions...'
      )}
    </div>
  );
}
