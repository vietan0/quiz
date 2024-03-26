import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
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

  return (
    <div
      data-testid="Quiz"
      className="m-auto flex min-h-screen w-screen flex-col justify-between"
    >
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
                navigate('/result');
                if (!result) setResult();
              }}
            >
              {result ? 'Go To Result' : 'Submit'}
            </Button>
          </div>
        </>
      ) : (
        <Spinner
          label="Preparing your questions..."
          classNames={{ base: 'm-auto' }}
        />
      )}
    </div>
  );
}
