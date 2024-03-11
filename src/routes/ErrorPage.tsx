import { Link, useRouteError } from 'react-router-dom';

interface RouteError {
  data: string;
  error: Error;
  internal: boolean;
  status: number;
  statusText: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      <Link to="/">Home</Link>
    </div>
  );
}
