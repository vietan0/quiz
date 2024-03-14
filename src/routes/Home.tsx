import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const difficulty = ['easy', 'medium', 'hard'] as const;
const category = ['pokemons', 'games', 'history'] as const;
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

const formSchema = z.object({
  questionCount: z.coerce.number().gte(5).lte(40),
  difficulty: z.enum(difficulty, {
    errorMap: (_issue, ctx) => {
      if (ctx.data === '') return { message: 'Difficulty cannot be empty' };

      return { message: ctx.defaultError };
    },
  }),
  category: z.enum(category, {
    errorMap: (_issue, ctx) => {
      if (ctx.data === '') return { message: 'Category cannot be empty' };

      return { message: ctx.defaultError };
    },
  }),
});
type Form = z.infer<typeof formSchema>;

export default function Home() {
  const { register, handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      questionCount: 5,
      difficulty: 'medium',
      category: 'games',
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Form> = (data) => console.log(data);

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
            {...register('questionCount')}
          />
          <span>{formState.errors.questionCount?.message}</span>
        </label>
        <label>
          Difficulty
          <br />
          <input
            className="rounded-md outline outline-1"
            type="text"
            {...register('difficulty')}
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
        <button
          onClick={() => reset()}
          type="button"
          className="rounded-md px-4 py-2 outline outline-1"
        >
          Use Defaults
        </button>
        <button className="rounded-md px-4 py-2 outline outline-1">
          Submit
        </button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
