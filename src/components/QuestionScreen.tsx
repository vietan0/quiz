import { RadioGroup } from '@nextui-org/radio';

import { QuestionShuffled } from '../types/schemas';
import capitalize from '../utils/capitalize';
import decodeQuestion from '../utils/decodeQuestion';
import AnswerRadio from './AnswerRadio';

export default function QuestionScreen({ q }: { q: QuestionShuffled }) {
  const { question, category, difficulty, answers } = decodeQuestion(q);

  return (
    <RadioGroup
      label={question}
      orientation="horizontal"
      description={`${category} - ${capitalize(difficulty)}`}
      classNames={{
        base: 'border-4 border-primary',
        label: 'text-3xl text-foreground',
        wrapper: 'grid auto-rows-fr grid-cols-2 justify-items-stretch gap-2',
      }}
    >
      {answers.map((answer, i) => (
        <AnswerRadio {...answer} index={i} key={i} />
      ))}
    </RadioGroup>
  );
}
