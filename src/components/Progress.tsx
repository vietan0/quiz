import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { useNavigate } from 'react-router-dom';

import useMainStore from '../useMainStore';
import cn from '../utils/cn';
import formatOrdinals from '../utils/formatOrdinals';
import MaterialSymbolsCloseRounded from './icons/MaterialSymbolsCloseRounded';

export default function Progress() {
  const index = useMainStore((state) => state.index);
  const setIndex = useMainStore((state) => state.setIndex);
  const picked = useMainStore((state) => state.picked);
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const navigate = useNavigate();

  return (
    <div
      id="Progress"
      className="flex items-center gap-4 border-b px-4 py-8 xs:px-8 sm:px-16 lg:px-32"
    >
      <Tooltip content="Cancel quiz" closeDelay={0}>
        <Button
          isIconOnly
          variant="light"
          aria-label="Cancel quiz"
          onPress={() => {
            resetQuiz();
            navigate('/');
          }}
        >
          <MaterialSymbolsCloseRounded />
        </Button>
      </Tooltip>
      <div
        className={cn(
          'grid w-full grid-cols-[repeat(auto-fit,_minmax(20px,_1fr))]',
          picked!.length <= 12 ? 'gap-2' : 'gap-[3px]',
        )}
      >
        {picked!.map((p, i) => (
          <Tooltip
            content={formatOrdinals(i + 1)}
            size="sm"
            placement="bottom"
            showArrow={true}
            key={i}
          >
            <Button
              variant="solid"
              onPress={() => setIndex(i)}
              className={cn(
                'h-5 min-w-5 p-0',
                picked!.length <= 12 ? 'rounded' : 'rounded-sm',
                p === undefined ? 'bg-gray-200/75' : 'bg-primary-200',
                index === i && 'bg-green-300',
              )}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
