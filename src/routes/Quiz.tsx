import { Button, ButtonGroup } from '@nextui-org/button';
import { AnimatePresence } from 'framer-motion';
import { motion, MotionGlobalConfig } from 'framer-motion';
import { Link } from 'react-router-dom';

import MaterialSymbolsArrowLeftAltRounded from '../components/icons/MaterialSymbolsArrowLeftAltRounded';
import MaterialSymbolsArrowRightAltRounded from '../components/icons/MaterialSymbolsArrowRightAltRounded';
import QuestionScreen from '../components/QuestionScreen';
import useStore from '../useStore';

export default function Quiz({ skip = false }) {
  MotionGlobalConfig.skipAnimations = skip;

  const { quiz, errorMsg, resetState, index, direction, moveIndex } = useStore(
    (s) => s,
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

  const variants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? 1000 : -1000,
      opacity: 0,
    }),
    stay: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div
      data-testid="Quiz"
      className="flex min-h-screen flex-col justify-between"
    >
      {errorMsg ? (
        errMsgDiv
      ) : quiz ? (
        <>
          <div
            id="progress-bar"
            className="border px-4 py-8 xs:px-8 sm:px-16 lg:px-32"
          >
            Question {index + 1} of {quiz.length}
          </div>
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={index}
              variants={variants}
              custom={direction}
              initial="enter"
              animate="stay"
              exit="exit"
              transition={{ type: 'tween' }}
            >
              <QuestionScreen q={quiz[index]} key={index} />
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center border px-4 py-8 xs:px-8 sm:px-16 lg:px-32">
            <ButtonGroup radius="md">
              <Button
                variant="ghost"
                size="lg"
                className="w-40"
                onPress={() => moveIndex(-1)}
                startContent={
                  <MaterialSymbolsArrowLeftAltRounded
                    viewBox={undefined}
                    width="1.5em"
                    height="1.5em"
                  />
                }
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-40"
                onPress={() => moveIndex(1)}
                endContent={
                  <MaterialSymbolsArrowRightAltRounded
                    viewBox={undefined}
                    width="1.5em"
                    height="1.5em"
                  />
                }
              >
                Next
              </Button>
            </ButtonGroup>
          </div>
        </>
      ) : (
        'Preparing some questions...'
      )}
    </div>
  );
}
