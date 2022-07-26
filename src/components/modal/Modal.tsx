import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";

function useModal(startOpen = false) {
  let [isOpen, setIsOpen] = useState(startOpen);
  let actions = useMemo(() => {
    return {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    };
  }, [setIsOpen]);

  return {
    ...actions,
    setIsOpen,
    isOpen,
  };
}

function useModalRoute(returnTo?: string) {
  let modal = useModal(true);
  let navigate = useNavigate();
  let [searchParams] = useSearchParams();
  let resolvedReturnTo: any = returnTo || searchParams.get("returnTo") || "..";

  useEffect(() => {
    if (!modal.isOpen) {
      navigate(resolvedReturnTo);
    }
  }, [modal.isOpen]);

  return modal;
}

export interface ModalProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
  showClose?: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger?: React.ReactNode;
  /** Defaults to true */
  closeOnClickOutside?: boolean;
}
export const Modal = ({
  children,
  title = "",
  showClose = true,
  isOpen,
  setIsOpen,
  closeOnClickOutside = true,
  trigger,
}: ModalProps) => {
  return (
    <AnimatePresence>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <Dialog.Trigger asChild={true}>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay asChild={true}>
            <motion.div
              className="fixed inset-0 z-50 grid modal-overlay bg-black/50 place-items-center"
              transition={{ duration: 0.07 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Dialog.Content
                asChild={true}
                onInteractOutside={(event) => {
                  if (!closeOnClickOutside) event.preventDefault();
                }}
              >
                <motion.div
                  transition={{ duration: 0.05 }}
                  initial={{ scale: 0.9, y: -30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="text-left whitespace-normal modal-box"
                >
                  <div className="flex justify-between modal-header ">
                    {title ? (
                      <Dialog.Title className="modal-title" asChild>
                        {typeof title === "string" ? (
                          <h2 className="flex items-center mb-8 text-xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {title}
                          </h2>
                        ) : (
                          title
                        )}
                      </Dialog.Title>
                    ) : (
                      <div></div>
                    )}

                    {showClose && (
                      <Dialog.Close asChild={true}>
                        <button className="relative rounded-full btn btn-ghost -top-4 -right-4">
                          <IoMdClose />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>

                  {children}
                </motion.div>
              </Dialog.Content>
            </motion.div>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </AnimatePresence>
  );
};
Modal.useModal = useModal;
Modal.useModalRoute = useModalRoute;
