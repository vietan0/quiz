import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';

import cn from '../utils/cn';
import formatOrdinals from '../utils/formatOrdinals';
import useMainStore from '../zustand/useMainStore';
import CancelQuiz from './CancelQuiz';

export default function Progress() {
  const index = useMainStore((state) => state.index);
  const setIndex = useMainStore((state) => state.setIndex);
  const picked = useMainStore((state) => state.picked);
  const result = useMainStore((state) => state.result);

  return (
    <div
      id="Progress"
      className="flex items-center gap-4 border-b px-4 py-8 xs:px-8 sm:px-16 lg:px-32"
    >
      {!result && <CancelQuiz />}
      <div
        className={cn(
          'grid w-full grid-cols-[repeat(auto-fit,_minmax(20px,_1fr))]',
          picked!.length <= 12 ? 'gap-2' : 'gap-[3px]',
        )}
      >
        {picked!.map((p, i) => {
          let bgColor, status;

          if (result) {
            if (result.correctMap[i]) {
              bgColor = 'bg-success-200';
              status = 'correct';
            } else {
              bgColor = 'bg-danger-100/75';
              status = 'incorrect';
            }
          } else {
            if (p === undefined) {
              bgColor = 'bg-gray-200/75';
              status = 'not-picked';
            } else {
              bgColor = 'bg-primary-100';
              status = 'picked';
            }
          }

          return (
            <Tooltip
              content={formatOrdinals(i + 1)}
              size="sm"
              radius="sm"
              placement="bottom"
              showArrow={true}
              key={i}
            >
              <Button
                onPress={() => setIndex(i)}
                aria-label={formatOrdinals(i + 1) + ' question'}
                data-status={status}
                className={cn(
                  'h-5 min-w-5 rounded p-0',
                  index === i && 'border-3 border-primary-300',
                  bgColor,
                )}
              />
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
