import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="m-10">
      <Link className="mr-4 underline" to="/">
        Home
      </Link>
      <Link className="mr-4 underline" to="/quiz">
        Quiz
      </Link>
      <Link className="mr-4 underline" to="/result">
        Result
      </Link>
      <Link className="mr-4 underline" to="/error">
        ErrorPage
      </Link>
      <Outlet />
    </div>
  );
}
