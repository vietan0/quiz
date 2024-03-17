import { z } from 'zod';

import {
  categoryNames,
  difficulty,
  openTriviaResponses,
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

const responseCodeErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (
    issue.code === z.ZodIssueCode.invalid_literal &&
    issue.path[0] === 'response_code'
  ) {
    // OpenTrivia error confirmed
    const response = openTriviaResponses.find(
      (key) => responseCodesMap[key] === issue.received,
    ) as Exclude<(typeof openTriviaResponses)[number], 'success'>;

    let openTriviaErrorMessage: string = 'OpenTriviaDB: ';

    switch (response) {
      case 'noResults':
        openTriviaErrorMessage +=
          "The API doesn't have enough questions for your query.";

        break;
      case 'invalidParams':
        openTriviaErrorMessage +=
          "Contains an invalid parameter. Arguements passed in URL aren't valid.";

        break;
      case 'tokenNotFound':
        openTriviaErrorMessage += 'Session Token does not exist.';
        break;
      case 'tokenEmpty':
        openTriviaErrorMessage +=
          'Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.';

        break;
      default:
        // rateLimit
        openTriviaErrorMessage +=
          'Too many requests have occurred. Each IP can only access the API once every 5 seconds.';

        break;
    }

    return { message: openTriviaErrorMessage };
  }

  return { message: ctx.defaultError };
};

const dataSchema = z.object({
  response_code: z.literal(0, {
    errorMap: responseCodeErrorMap,
  }),
  results: z.array(questionSchema),
});

type Form = z.infer<typeof formSchema>;
type Question = z.infer<typeof questionSchema>;
type Data = z.infer<typeof dataSchema>;

export { dataSchema, formSchema, questionSchema, urlSchema };
export type { Data, Form, Question };
