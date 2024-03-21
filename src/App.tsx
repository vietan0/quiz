import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div id="App" className="mx-auto max-w-screen-2xl">
      <Outlet />
    </div>
  );
}
