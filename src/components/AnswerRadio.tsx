import { Radio } from '@nextui-org/radio';
import { encode } from 'html-entities';

import cn from '../utils/cn';
type Props = {
  value: string;
  correct?: boolean;
  index: number;
};

export default function AnswerRadio({ value, correct = false, index }: Props) {
  return (
    <Radio
      value={encode(value)}
      description={index + 1}
      classNames={{
        base: cn(
          'm-0 max-w-none rounded-xl border border-b-4 border-default p-4',
          'data-[selected=true]:border-primary',
          'data-[pressed=true]:border-primary',
          'data-[pressed=true]:border-b-1',
          'data-[pressed=true]:translate-y-[1px]',
        ),
        wrapper: 'hidden',
        labelWrapper: 'w-full flex-row justify-between',
        label: cn(correct && 'font-bold text-green-600'),
        description:
          'self-center rounded-md px-2 py-1 text-xs leading-4 text-default-500 outline outline-1 outline-default',
      }}
    >
      {value}
    </Radio>
  );
}
