import App from '../App';
import ErrorPage from './ErrorPage';
import Home from './Home';
import Quiz from './Quiz';
import Result from './Result';

export default [
  {
    path: '/',
    element: <App />,
    errorElement: <App error={<ErrorPage />} />,
    children: [
      { index: true, element: <Home /> },
      { path: '/quiz', element: <Quiz /> },
      { path: '/result', element: <Result /> },
    ],
  },
];
