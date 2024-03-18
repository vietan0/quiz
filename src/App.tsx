import { NavLink, Outlet } from 'react-router-dom';

import useQuizStore from './quizStore';

const style = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? 'rgb(59 130 246)' : 'currentColor',
});

export default function App() {
  const resetState = useQuizStore((state) => state.resetState);

  return (
    <div className="m-10">
      <NavLink
        className="mr-4 underline"
        style={style}
        to="/"
        onClick={resetState}
      >
        Home
      </NavLink>
      <NavLink className="mr-4 underline" style={style} to="/quiz">
        Quiz
      </NavLink>
      <NavLink className="mr-4 underline" style={style} to="/result">
        Result
      </NavLink>
      <NavLink className="mr-4 underline" style={style} to="/error">
        ErrorPage
      </NavLink>
      <Outlet />
    </div>
  );
}
