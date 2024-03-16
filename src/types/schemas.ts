import { z } from 'zod';

import {
  categoryNames,
  difficulty,
  questionType,
  responseCodesMap,
} from './api-data';

const formSchema = z.object({
  questionCount: z.coerce.number().int().gte(3).lte(40),
  difficulty: z.enum(difficulty, {
    errorMap: (_issue, ctx) => {
      if (ctx.data === '') return { message: 'Difficulty cannot be empty' };

      return { message: ctx.defaultError };
    },
  }),
  category: z.enum(categoryNames, {
    errorMap: (_issue, ctx) => {
      if (ctx.data === '') return { message: 'Category cannot be empty' };

      return { message: ctx.defaultError };
    },
  }),
});

const urlSchema = z.string().url({ message: 'Invalid URL' });

const questionSchema = z.object({
  type: z.enum(questionType),
  difficulty: z.enum(difficulty),
  category: z.enum(categoryNames),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.array(z.string()),
});

const dataSchema = z.object({
  response_code: z.nativeEnum(responseCodesMap),
  results: z.array(questionSchema),
});

type Form = z.infer<typeof formSchema>;
type Question = z.infer<typeof questionSchema>;
type Data = z.infer<typeof dataSchema>;

export { dataSchema, formSchema, questionSchema, urlSchema };

export type { Data, Form, Question };
