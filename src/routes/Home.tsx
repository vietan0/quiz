import { DevTool } from '@hookform/devtools';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { SubmitHandler, useForm } from 'react-hook-form';

const difficulty = ['easy', 'medium', 'hard'] as const;
const category = ['pokemons', 'games', 'history'];
export const Nexts = () => (
  <>
    <Input
      type="number"
      label="Number of questions"
      placeholder="5"
      fullWidth={false}
      variant="bordered"
      min={1}
      max={40}
    />
    <Select
      label="Difficulty"
      placeholder="Select a difficulty"
      variant="bordered"
    >
      {difficulty.map((d) => (
        <SelectItem key={d} value={d}>
          {d}
        </SelectItem>
      ))}
    </Select>
    <Select label="Category" placeholder="Select a category" variant="bordered">
      {category.map((c) => (
        <SelectItem key={c} value={c}>
          {c}
        </SelectItem>
      ))}
    </Select>
  </>
);

type Inputs = {
  questionCount: string;
  difficulty: (typeof difficulty)[number];
  category: string;
};

export default function Home() {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState,
    control,
  } = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      questionCount: '5',
      difficulty: 'medium',
      category: 'cricket',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div>
      <p className="text-4xl font-bold">Quiz</p>
      <p>Test your knowledge with some quick trivia!</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <label>
          Number of questions
          <br />
          <input
            className="rounded-md outline outline-1"
            type="number"
            {...register('questionCount', {
              min: { value: 5, message: 'Gotta be at least 5' },
              max: { value: 40, message: 'At most 40' },
            })}
          />
          <span>{formState.errors.questionCount?.message}</span>
        </label>
        <label>
          Difficulty
          <br />
          <input
            className="rounded-md outline outline-1"
            type="text"
            {...register('difficulty', {
              validate: (value) =>
                difficulty.includes(value) ||
                'Difficulty must be either easy, medium or difficult',
            })}
          />
          <span>{formState.errors.difficulty?.message}</span>
        </label>
        <label>
          Category
          <br />
          <input
            className="rounded-md outline outline-1"
            type="text"
            {...register('category')}
          />
          <span>{formState.errors.category?.message}</span>
        </label>
        <pre>isValid is {JSON.stringify(formState.isValid)}</pre>
        <button
          onClick={() => console.log(getValues())}
          type="button"
          className="rounded-md px-4 py-2 outline outline-1"
        >
          Get Value
        </button>
        <button
          onClick={() => setValue('difficulty', 'easy')}
          type="button"
          className="rounded-md px-4 py-2 outline outline-1"
        >
          Set Value
        </button>
        <button
          onClick={() => reset()}
          type="button"
          className="rounded-md px-4 py-2 outline outline-1"
        >
          Reset
        </button>
        <button className="rounded-md px-4 py-2 outline outline-1">
          Submit
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
