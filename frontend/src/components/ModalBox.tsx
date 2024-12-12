import { Modal, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { cancelModal, confirmModal } from "../slices/modalSlice";

export const ModalBox = () => {
  const dispatch = useAppDispatch();
  const { open, type, id } = useAppSelector((state) => state.modal);

  return (
    <>
      <Modal isOpen={open} hideCloseButton={true}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete {type} {id}?
            </ModalHeader>
            <ModalFooter>
              <Button
                color="success"
                variant="light"
                onPress={() => {
                  dispatch(cancelModal());
                }}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                variant="bordered"
                onPress={() => {
                  dispatch(confirmModal());
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalBox;
