import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { useNavigate } from 'react-router-dom';

import cn from '../utils/cn';
import formatOrdinals from '../utils/formatOrdinals';
import useMainStore from '../zustand/useMainStore';

export default function Progress() {
  const index = useMainStore((state) => state.index);
  const setIndex = useMainStore((state) => state.setIndex);
  const picked = useMainStore((state) => state.picked);
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const result = useMainStore((state) => state.result);
  const navigate = useNavigate();

  return (
    <div
      id="Progress"
      className="flex items-center gap-4 border-b px-4 py-8 xs:px-8 sm:px-16 lg:px-32"
    >
      {!result && (
        <Tooltip content="Cancel quiz" radius="sm" closeDelay={0}>
          <Button
            isIconOnly
            variant="light"
            radius="sm"
            aria-label="Cancel quiz"
            onPress={() => {
              resetQuiz();
              navigate('/');
            }}
          >
            <Icon
              icon="material-symbols:close-rounded"
              width={24}
              height={24}
              className="text-default-500"
            />
          </Button>
        </Tooltip>
      )}
      <div
        className={cn(
          'grid w-full grid-cols-[repeat(auto-fit,_minmax(20px,_1fr))]',
          picked!.length <= 12 ? 'gap-2' : 'gap-[3px]',
        )}
      >
        {picked!.map((p, i) => {
          let bgColor;

          if (result) {
            bgColor = result.correctMap[i]
              ? 'bg-success-200'
              : 'bg-danger-100/75';
          } else {
            bgColor = p === undefined ? 'bg-gray-200/75' : 'bg-primary-100';
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
