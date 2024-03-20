import { Radio } from '@nextui-org/radio';
import { cn } from '@nextui-org/system';
type Props = {
  text: string;
  correct?: boolean;
  index: number;
};

export default function AnswerRadio({ text, correct = false, index }: Props) {
  return (
    <Radio
      value={text}
      classNames={{
        base: cn(
          'm-0 max-w-none rounded-md border border-b-4 border-default p-4',
          'data-[selected=true]:border-primary',
          'data-[pressed=true]:border-primary',
          'data-[pressed=true]:border-b-1',
          'data-[pressed=true]:translate-y-[2px]',
        ),
        wrapper: 'hidden', // hide circle
        label: 'flex justify-between',
        labelWrapper: 'w-full',
      }}
    >
      <p className={cn(correct && 'font-bold text-green-600')}>{text}</p>
      <p className="self-center rounded-md px-2 py-1 text-sm leading-4 text-default-500 outline outline-1 outline-default">
        {index + 1}
      </p>
    </Radio>
  );
}
