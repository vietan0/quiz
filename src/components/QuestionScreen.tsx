import { RadioGroup } from '@nextui-org/radio';

import { QuestionShuffled } from '../types/schemas';
import decodeQuestion from '../utils/decodeQuestion';
import AnswerRadio from './AnswerRadio';

export default function QuestionScreen({ q }: { q: QuestionShuffled }) {
  const { question, answers } = decodeQuestion(q);

  return (
    <RadioGroup
      label={question}
      orientation="horizontal"
      classNames={{
        base: 'flex-grow gap-20 px-4 py-8 xs:px-8 sm:px-24 lg:px-48',
        label: 'min-h-20 text-2xl font-bold text-foreground',
        wrapper: 'grid auto-rows-fr justify-items-stretch gap-2 sm:grid-cols-2',
      }}
    >
      {answers.map((answer, i) => (
        <AnswerRadio {...answer} index={i} key={i} />
      ))}
    </RadioGroup>
  );
}
