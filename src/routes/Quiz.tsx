import { AnimatePresence, motion } from 'framer-motion';

import QuestionScreen from '../components/QuestionScreen';
import useMainStore from '../zustand/useMainStore';

export default function Quiz() {
  const { quiz, index, direction } = useMainStore();

  const variants = {
    enter: (direction: 1 | -1) => ({
      x: direction === 1 ? 60 : -60,
      opacity: 0,
    }),
    stay: { x: 0, opacity: 1 },
    exit: (direction: 1 | -1) => ({
      x: direction === 1 ? -60 : 60,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence mode="popLayout" custom={direction}>
      <motion.div
        key={index}
        variants={variants}
        custom={direction}
        initial="enter"
        animate="stay"
        exit="exit"
        transition={{ type: 'tween' }}
        data-testid="motion.div"
      >
        <QuestionScreen q={quiz![index]} index={index} key={index} />
      </motion.div>
    </AnimatePresence>
  );
}
