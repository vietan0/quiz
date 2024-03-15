import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fromZodError } from 'zod-validation-error';

import { categoryNames, difficulty } from '../types/api-data';
import { Data, dataSchema, Form, formSchema } from '../types/schemas';
import openTriviaErrorHandling from '../utils/openTriviaErrorHandling';
import urlJoin from '../utils/urlJoin';

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
      {categoryNames.map((c) => (
        <SelectItem key={c} value={c}>
          {c}
        </SelectItem>
      ))}
    </Select>
  </>
);

export default function Home() {
  const [data, setData] = useState<Data>({} as Data);

  const { register, handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues: {
      questionCount: 5,
      difficulty: 'any',
      category: 'Any Category',
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const validUrl = urlJoin(data);
    const res = await fetch(validUrl);
    const fetchedData = await res.json();
    const result = dataSchema.safeParse(fetchedData);

    if (result.success) {
      openTriviaErrorHandling(result.data, setData);
    } else {
      const validationError = fromZodError(result.error);
      console.log(validationError.toString());
    }
  };

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  return (
    <div>
      <p className="text-4xl font-bold">Quiz</p>
      <p>Test your knowledge with some quick trivia!</p>
      <form
        onSubmit={(e) =>
          handleSubmit(onSubmit)(e).catch((e) =>
            console.log('Error while fetching', e),
          )
        }
        className="flex flex-col gap-4"
      >
        <label>
          Number of questions
          <br />
          <input
            className="rounded-md outline outline-1"
            type="number"
            {...register('questionCount')}
          />
          <p>{formState.errors.questionCount?.message}</p>
        </label>
        <label>
          Difficulty
          <br />
          <input
            className="rounded-md outline outline-1"
            type="text"
            {...register('difficulty')}
          />
          <p>{formState.errors.difficulty?.message}</p>
        </label>
        <label>
          Category
          <br />
          <input
            className="rounded-md outline outline-1"
            type="text"
            {...register('category')}
          />
          <p>{formState.errors.category?.message}</p>
        </label>
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
