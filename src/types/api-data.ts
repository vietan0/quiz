const questionType = ['multiple', 'boolean'] as const;
const difficulty = ['any', 'easy', 'medium', 'hard'] as const;

const categoryNames = [
  'Any Category',
  'General Knowledge',
  'Entertainment: Books',
  'Entertainment: Film',
  'Entertainment: Music',
  'Entertainment: Musicals &amp; Theatres',
  'Entertainment: Television',
  'Entertainment: Video Games',
  'Entertainment: Board Games',
  'Science &amp; Nature',
  'Science: Computers',
  'Science: Mathematics',
  'Mythology',
  'Sports',
  'Geography',
  'History',
  'Politics',
  'Art',
  'Celebrities',
  'Animals',
  'Vehicles',
  'Entertainment: Comics',
  'Science: Gadgets',
  'Entertainment: Japanese Anime &amp; Manga',
  'Entertainment: Cartoon &amp; Animations',
] as const;

const categories: Record<(typeof categoryNames)[number], string> = {
  'Any Category': '0',
  'General Knowledge': '9',
  'Entertainment: Books': '10',
  'Entertainment: Film': '11',
  'Entertainment: Music': '12',
  'Entertainment: Musicals &amp; Theatres': '13',
  'Entertainment: Television': '14',
  'Entertainment: Video Games': '15',
  'Entertainment: Board Games': '16',
  'Science &amp; Nature': '17',
  'Science: Computers': '18',
  'Science: Mathematics': '19',
  Mythology: '20',
  Sports: '21',
  Geography: '22',
  History: '23',
  Politics: '24',
  Art: '25',
  Celebrities: '26',
  Animals: '27',
  Vehicles: '28',
  'Entertainment: Comics': '29',
  'Science: Gadgets': '30',
  'Entertainment: Japanese Anime &amp; Manga': '31',
  'Entertainment: Cartoon &amp; Animations': '32',
} as const;

const openTriviaResponses = [
  'success',
  'noResults',
  'invalidParams',
  'tokenNotEnough',
  'tokenEmpty',
  'rateLimit',
] as const;

const openTriviaResponseCodes = [0, 1, 2, 3, 4, 5] as const;

const responseCodesMap: Record<
  (typeof openTriviaResponses)[number],
  (typeof openTriviaResponseCodes)[number]
> = {
  success: 0,
  noResults: 1,
  invalidParams: 2,
  tokenNotEnough: 3,
  tokenEmpty: 4,
  rateLimit: 5,
};

export {
  categories,
  categoryNames,
  difficulty,
  openTriviaResponseCodes,
  openTriviaResponses,
  questionType,
  responseCodesMap,
};
