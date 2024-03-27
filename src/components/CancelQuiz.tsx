import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/modal';
import { Tooltip } from '@nextui-org/tooltip';
import { useNavigate } from 'react-router-dom';

import useMainStore from '../zustand/useMainStore';

export default function CancelQuiz() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const resetQuiz = useMainStore((state) => state.resetQuiz);
  const navigate = useNavigate();

  return (
    <>
      <Tooltip content="Cancel quiz" radius="sm" closeDelay={0}>
        <Button
          isIconOnly
          variant="light"
          radius="sm"
          aria-label="Cancel quiz"
          onPress={onOpen}
        >
          <Icon
            icon="material-symbols:close-rounded"
            width={24}
            height={24}
            className="text-default-500"
          />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are your sure you want to cancel?
              </ModalHeader>
              <ModalBody>You'll lose your progress.</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  radius="sm"
                  variant="ghost"
                  onPress={onClose}
                >
                  Keep Playing
                </Button>
                <Button
                  color="danger"
                  radius="sm"
                  onPress={() => {
                    onClose();
                    resetQuiz();
                    navigate('/');
                  }}
                >
                  Quit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
