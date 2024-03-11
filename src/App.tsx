import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="m-20">
      <Link to="/quiz">Quiz</Link>
      <Link to="/result">Result</Link>
      <Link to="/error">ErrorPage</Link>
      <Outlet />
    </div>
  );
}
