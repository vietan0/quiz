import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { fromZodError } from 'zod-validation-error';

import {
  categories,
  categoryNames,
  difficulty,
  openTriviaResponses,
  responseCodesMap,
} from '../types/api-data';
import { dataSchema, Form, formSchema, urlSchema } from '../types/schemas';

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
  const [data, setData] = useState({});

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
    const { questionCount, difficulty, category } = data;
    const questionCountQuery = `?amount=${questionCount}`;

    const difficultyQuery =
      difficulty === 'any' ? '' : `&difficulty=${difficulty}`;

    const categoryQuery =
      category === 'Any Category' ? '' : `&category=${categories[category]}`;

    const url = `https://opentdb.com/api.php${questionCountQuery}${difficultyQuery}${categoryQuery}`;
    const validUrl = urlSchema.parse(url);
    console.log(validUrl);

    const res = await fetch(`https://opentdb.com/api.php?amount=0`);
    const fetchedData = await res.json();
    const result = dataSchema.safeParse(fetchedData);
    console.log(result);

    if (result.success) {
      const receivedCode = result.data.response_code;

      if (receivedCode === 0) {
        setData(result.data);
      } else {
        const response = openTriviaResponses.find(
          (key) => responseCodesMap[key] === receivedCode,
        );

        console.log(response);
      }
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
