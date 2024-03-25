import { Button } from '@nextui-org/button';
import { Link } from 'react-router-dom';

import useMainStore from '../zustand/useMainStore';

export default function Result() {
  const result = useMainStore((state) => state.result);

  return (
    <div>
      Result
      <pre>{JSON.stringify(result)}</pre>
      <Link to="/">Home</Link>
      <p className="text-3xl">Way to go!</p>
      <div className="flex justify-between border-t px-4 py-8 xs:px-8 sm:px-16 lg:px-32">
        <Button size="lg" className="w-40 bg-success-400 font-bold text-white">
          Review Lesson
        </Button>
        <Button size="lg" className="w-40 bg-success-400 font-bold text-white">
          Continue
        </Button>
      </div>
    </div>
  );
}
