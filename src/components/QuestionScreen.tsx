import { RadioGroup } from '@nextui-org/radio';

import { Question } from '../types/schemas';
import decodeQuestion from '../utils/decodeQuestion';
import shuffleAnswers from '../utils/shuffleAnswers';
import AnswerRadio from './AnswerRadio';

type Props = {
  q: Question;
  index: number;
};

export default function QuestionScreen({ q, index }: Props) {
  const { question, category, difficulty, correct_answer, incorrect_answers } =
    decodeQuestion(q);

  return (
    <div className="m-10">
      <p>Question {index + 1}</p>
      <p>
        {category} - {difficulty}
      </p>
      <RadioGroup
        label={question}
        orientation="horizontal"
        classNames={{
          label: 'text-3xl text-foreground',
          wrapper: 'grid auto-rows-fr grid-cols-2 justify-items-stretch gap-2',
        }}
      >
        {shuffleAnswers(correct_answer, incorrect_answers).map(
          ({ value: text, correct }, i) => (
            <AnswerRadio text={text} correct={correct} index={i} key={i} />
          ),
        )}
      </RadioGroup>
    </div>
  );
}
