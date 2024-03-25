import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, ButtonGroup } from '@nextui-org/button';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import Progress from '../components/Progress';
import useMainStore from '../zustand/useMainStore';

export default function QuizResultLayout() {
  const navigate = useNavigate();

  const { quiz, quizErrMsg, resetQuiz, index, moveIndex, picked } =
    useMainStore();

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
    <div className="flex min-h-screen flex-col justify-between">
      {quizErrMsg ? (
        errMsgDiv
      ) : quiz ? (
        <>
          <Progress />
          <Outlet />
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
              className="w-40 bg-green-500 font-bold text-white"
              onPress={() => navigate('/result')}
            >
              Submit
            </Button>
          </div>
        </>
      ) : (
        'Preparing some questions...'
      )}
    </div>
  );
}
