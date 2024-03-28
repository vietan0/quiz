import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function App({ error }: { error?: React.ReactNode }) {
  useEffect(() => {
    const root = document.getElementById('root');

    if (root) {
      root.role = 'presentation';
    }
  }, []);

  return (
    <div id="App" className="flex min-h-screen max-w-screen-2xl">
      <h1 className="sr-only">Quiz App - Made by Viet An</h1>
      {error ?? (
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      )}
    </div>
  );
}
