import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';

export default function App({ error }: { error?: React.ReactNode }) {
  return (
    <div id="App" className="flex min-h-screen max-w-screen-2xl">
      {error ?? (
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      )}
    </div>
  );
}
