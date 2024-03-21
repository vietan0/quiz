import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { decode } from 'html-entities';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import fetchQuiz from '../api';
import { categoryNames, difficulty } from '../types/api-data';
import { Form, formSchema } from '../types/schemas';
import useStore from '../useStore';
import capitalize from '../utils/capitalize';
import urlJoin from '../utils/urlJoin';

const defaultValues: Form = {
  questionCount: 5,
  difficulty: 'any',
  category: 'Any Category',
};

export default function Home() {
  const { setQuiz, resetState, setErrorMsg } = useStore((s) => s);
  const navigate = useNavigate();

  const { handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const validUrl = urlJoin(data);

    try {
      navigate('/quiz');
      setQuiz(await fetchQuiz(validUrl));
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        setErrorMsg(validationError.toString());
      } else {
        const err = error as Error;
        setErrorMsg(err.message);
      }
    }
  };

  return (
    <div id="Home" className="m-10">
      <h1 className="text-4xl font-bold">Home</h1>
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
              scrollShadowProps={{
                isEnabled: false,
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
            resetState();
          }}
        >
          Reset Form
        </Button>
        <Button variant="ghost" type="submit" color="primary">
          Submit
        </Button>
      </form>
      <DevTool control={control} />
    </div>
  );
}
