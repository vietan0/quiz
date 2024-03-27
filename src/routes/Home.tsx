import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { motion } from 'framer-motion';
import { decode } from 'html-entities';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

import fetchQuiz from '../api';
import { categoryNames, difficulty } from '../types/api-data';
import { Form, formSchema } from '../types/schemas';
import urlJoin from '../utils/urlJoin';
import useMainStore from '../zustand/useMainStore';

const defaultValues: Form = {
  questionCount: 5,
  difficulty: 'any',
  category: 'Any Category',
};

export default function Home() {
  const setQuiz = useMainStore((state) => state.setQuiz);
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const quizErrMsg = useMainStore((state) => state.quizErrMsg);
  const setquizErrMsg = useMainStore((state) => state.setquizErrMsg);
  const navigate = useNavigate();

  const { handleSubmit, reset, formState, control } = useForm<Form>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<Form> = async (data) => {
    const validUrl = urlJoin(data);

    try {
      setQuiz(await fetchQuiz(validUrl));
      navigate('/quiz');
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        setquizErrMsg(validationError.toString());
      } else {
        const err = error as Error;
        setquizErrMsg(err.message);
      }
    }
  };

  return (
    <motion.div
      data-testid="Home"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="m-auto min-h-[500px] w-full p-4 sm:max-w-lg"
    >
      <h1 className="mb-2 text-5xl font-bold tracking-tighter">Quiz</h1>
      <p>Test your knowledge with some quick trivia!</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 flex max-w-lg flex-col gap-2"
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
              classNames={{ value: 'capitalize' }}
              listboxProps={{
                itemClasses: {
                  base: ['data-[selectable=true]:focus:bg-default-300/40'],
                  title: 'capitalize',
                },
              }}
            >
              {difficulty.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
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
        <div className="mt-4 flex flex-wrap gap-4">
          <Button
            variant="ghost"
            size="lg"
            onPress={() => {
              reset();
              resetQuiz();
            }}
            className="w-full sm:flex-1"
            isDisabled={formState.isSubmitting}
          >
            Reset Form
          </Button>
          <Button
            variant="ghost"
            size="lg"
            type="submit"
            color="primary"
            className="w-full font-bold sm:flex-1"
            isLoading={formState.isSubmitting}
          >
            Start
          </Button>
        </div>
        {quizErrMsg && (
          <div className="mt-2 text-small text-danger">
            <p>Failure while getting quiz:</p>
            <code data-testid="quizErrMsg">{quizErrMsg}</code>
          </div>
        )}
      </form>
      <DevTool control={control} />
    </motion.div>
  );
}
