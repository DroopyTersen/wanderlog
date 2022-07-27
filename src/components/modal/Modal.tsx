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
              className="fixed inset-0 z-50 grid modal-overlay bg-white/20  justify-center items-start"
              transition={{ duration: 0.1 }}
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
                  transition={{ duration: 0.1 }}
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="text-left whitespace-normal p-8 bg-primary-700/70 backdrop-blur-md shadow rounded-xl w-[500px] max-w-[94vw]  mt-[min(20vw,20vh)]"
                >
                  <div className="flex justify-between modal-header items-center">
                    {title ? (
                      <Dialog.Title className="modal-title title-text" asChild>
                        {typeof title === "string" ? (
                          <h2 className="flex items-center mb-8 text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate my-0">
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
