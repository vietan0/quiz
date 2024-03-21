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
          'group m-0 max-w-none rounded-xl border border-b-4 border-default px-4 py-8',
          'data-[pressed=true]:border-primary-300',
          'data-[pressed=true]:border-b-1',
          'data-[pressed=true]:translate-y-[1px]',
          'data-[selected=true]:border-primary-300',
          'data-[selected=true]:bg-primary-50',
          '[&_span]:data-[selected=true]:text-primary',
          '[&_span:last-child]:data-[selected=true]:border-primary-300',
          '[&_span:last-child]:data-[selected=true]:font-bold',
        ),
        wrapper: 'hidden',
        labelWrapper: 'w-full flex-row justify-between',
        label: cn(correct && 'font-bold text-green-600'),
        description:
          'self-center rounded-md border-1 border-default px-2 py-1 text-xs leading-4 text-default-500',
      }}
    >
      {value}
    </Radio>
  );
}
