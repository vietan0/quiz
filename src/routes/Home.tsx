import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { decode } from 'html-entities';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { fromZodError } from 'zod-validation-error';

import { categoryNames, difficulty } from '../types/api-data';
import { Data, dataSchema, Form, formSchema } from '../types/schemas';
import capitalize from '../utils/capitalize';
import openTriviaErrorHandling from '../utils/openTriviaErrorHandling';
import urlJoin from '../utils/urlJoin';

const defaultValues: Form = {
  questionCount: 5,
  difficulty: 'any',
  category: 'Any Category',
};

export default function Home() {
  const [data, setData] = useState<Data>({} as Data);

  const { handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues,
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
        className="flex max-w-sm flex-col gap-4"
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
              min={3}
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
        <Button variant="ghost" type="button" onPress={() => reset()}>
          Reset
        </Button>
        <Button variant="ghost" color="primary">
          Submit
        </Button>
      </form>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <DevTool control={control} />
    </div>
  );
}
