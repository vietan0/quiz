import { Radio } from '@nextui-org/radio';
import { encode } from 'html-entities';

import cn from '../utils/cn';
import useMainStore from '../zustand/useMainStore';
type Props = {
  answer: string;
  answerIndex: number;
  index: number;
};

export default function AnswerRadio({ answer, answerIndex, index }: Props) {
  const quiz = useMainStore((state) => state.quiz);
  const result = useMainStore((state) => state.result);

  const focusVisibleHighlight = [
    'data-[focus-visible=true]:outline',
    'data-[focus-visible=true]:outline-offset-2',
    'data-[focus-visible=true]:outline-primary-300',
  ];

  const pressedHighlight = [
    'data-[pressed=true]:border-primary-300',
    'data-[pressed=true]:border-b-1',
    'data-[pressed=true]:translate-y-[1px]',
  ];

  const selectedHighlight = [
    'data-[selected=true]:border-primary-300',
    'data-[selected=true]:bg-primary-50',
    '[&_span]:data-[selected=true]:text-primary',
    '[&_span:last-child]:data-[selected=true]:border-primary-300',
  ];

  const correctHightlight = [
    '!border-success-300',
    '!bg-success-50',
    '[&_span]:!text-success-600',
    '[&_span]:!font-bold',
    '[&_span:last-child]:!border-success-300',
  ];

  return (
    <Radio
      value={encode(answer)}
      description={answerIndex + 1}
      classNames={{
        base: cn(
          'group m-0 max-w-none rounded-xl border border-b-4 border-default px-4 py-8',
          'data-[disabled=true]:opacity-80',
          focusVisibleHighlight,
          pressedHighlight,
          selectedHighlight,
          result && answer === quiz![index].correct_answer && correctHightlight,
        ),
        wrapper: 'hidden',
        labelWrapper: 'w-full flex-row justify-between',
        description:
          'self-center rounded-md border-1 border-default px-2 py-1 text-xs leading-4 text-default-500',
      }}
    >
      {answer}
    </Radio>
  );
}
