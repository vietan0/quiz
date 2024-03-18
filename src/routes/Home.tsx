import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { decode } from 'html-entities';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import fetchQuiz from '../api';
import useQuizStore from '../quizStore';
import { categoryNames, difficulty } from '../types/api-data';
import { Form, formSchema } from '../types/schemas';
import capitalize from '../utils/capitalize';
import urlJoin from '../utils/urlJoin';

const defaultValues: Form = {
  questionCount: 5,
  difficulty: 'any',
  category: 'Any Category',
};

export default function Home() {
  const { quiz, setQuiz, resetQuiz } = useQuizStore((s) => s);
  const [errMsg, setErrMsg] = useState('');

  const { handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const validUrl = urlJoin(data);

    try {
      setQuiz(await fetchQuiz(validUrl));
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        setErrMsg(validationError.toString());
      } else {
        const err = error as Error;
        setErrMsg(err.message);
      }
    }
  };

  return (
    <div>
      <p className="text-4xl font-bold">Quiz</p>
      <p>Test your knowledge with some quick trivia!</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex max-w-sm flex-col gap-2"
      >
        <Controller
          name="questionCount"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value.toString()} // nextui issue #1404
              type="number"
              label="Number of questions"
              min={1}
              max={40}
              isInvalid={Boolean(formState.errors.questionCount)}
              errorMessage={formState.errors.questionCount?.message}
            />
          )}
        />
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Difficulty"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[field.value]}
              isInvalid={Boolean(formState.errors.difficulty)}
              errorMessage={formState.errors.difficulty?.message}
              listboxProps={{
                itemClasses: {
                  base: ['data-[selectable=true]:focus:bg-default-300/40'],
                },
              }}
            >
              {difficulty.map((d) => (
                <SelectItem key={d} value={d}>
                  {capitalize(d)}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Category"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[field.value]}
              isInvalid={Boolean(formState.errors.category)}
              errorMessage={formState.errors.category?.message}
              listboxProps={{
                itemClasses: {
                  base: ['data-[selectable=true]:focus:bg-default-300/40'],
                },
              }}
            >
              {categoryNames.map((c) => (
                <SelectItem key={c} value={c}>
                  {decode(c)}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <Button
          variant="ghost"
          onPress={() => {
            reset();
            setErrMsg('');
          }}
        >
          Reset
        </Button>
        <Button variant="ghost" type="submit" color="primary">
          Submit
        </Button>
        <p className="text-sm text-red-500" data-testid="submit-error-message">
          {errMsg}
        </p>
      </form>
      <Button variant="ghost" color="danger" onPress={resetQuiz}>
        Reset Quiz
      </Button>
      <pre>{JSON.stringify(quiz, null, 2)}</pre>
      <DevTool control={control} />
    </div>
  );
}
