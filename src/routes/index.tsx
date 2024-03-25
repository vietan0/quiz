import App from '../App';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Quiz from './Quiz';
import QuizResultLayout from './QuizResultLayout';
import Result from './Result';

export default [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        element: <QuizResultLayout />,
        children: [
          { path: '/quiz', element: <Quiz /> },
          { path: '/result', element: <Result /> },
        ],
      },
    ],
  },
];
