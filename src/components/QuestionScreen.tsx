import { RadioGroup } from '@nextui-org/radio';

import { QuestionShuffled } from '../types/schemas';
import decodeQuestion from '../utils/decodeQuestion';
import useMainStore from '../zustand/useMainStore';
import AnswerRadio from './AnswerRadio';

export default function QuestionScreen({
  q,
  index,
}: {
  q: QuestionShuffled;
  index: number;
}) {
  const { question, answers } = decodeQuestion(q);
  const picked = useMainStore((state) => state.picked);
  const setPicked = useMainStore((state) => state.setPicked);
  const result = useMainStore((state) => state.result);

  return (
    <RadioGroup
      label={question}
      orientation="horizontal"
      value={picked![index]}
      onValueChange={(encodedValue) => {
        setPicked(encodedValue, index);
      }}
      isDisabled={Boolean(result)}
      classNames={{
        base: 'min-h-[440px] flex-grow gap-20 px-4 py-8 xs:px-8 sm:px-24 sm:py-0 lg:px-48',
        label: 'min-h-16 text-2xl font-bold text-foreground',
        wrapper: 'grid auto-rows-fr justify-items-stretch gap-2 sm:grid-cols-2',
      }}
    >
      {answers.map((answer, i) => (
        <AnswerRadio answer={answer} answerIndex={i} index={index} key={i} />
      ))}
    </RadioGroup>
  );
}
