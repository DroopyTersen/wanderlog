import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { Modal } from "./Modal";

interface ConfirmationProps {
  title?: string;
  body?: React.ReactNode;
  cancel?: string;
  confirm?: string;
  as?: string;
}

export interface ConfirmationButtonProps {
  className?: string;
  children?: React.ReactNode;
  /** Form data intent */
  formData: any;
  /** Form action */
  action?: string;
  confirmation?: ConfirmationProps;
  startOpen?: boolean;
  [key: string]: any;
}

export type ConfirmationModalProps = {
  trigger?: React.ReactNode;
  className?: string;
  /** Form data intent */
  formData: any;
  /** Form action */
  action?: string;
  method?: "post" | "put" | "delete";
  confirmation?: ConfirmationProps;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const confirmationDefaults: ConfirmationProps = {
  title: "Are you sure?",
  body: "",
  cancel: "Nevermind",
  confirm: "Yes, do it.",
};

export function ConfirmationModal({
  formData,
  action,
  method = "post",
  trigger,
  confirmation,
  isOpen,
  setIsOpen,
}: ConfirmationModalProps) {
  let fetcher = useFetcher();
  let errors = fetcher?.data?.errors;
  let status = errors ? "error" : fetcher?.state;

  useEffect(() => {
    if (fetcher?.state === "idle" && fetcher?.data?.status === "success") {
      setIsOpen(false);
    }
  }, [fetcher.state, fetcher?.data]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      showClose={false}
      title={confirmation?.title || confirmationDefaults.title}
      trigger={trigger}
    >
      <>
        {confirmation?.body ? (
          <div className="w-[500px] max-w-full">{confirmation.body}</div>
        ) : null}
        {status === "error" && (
          <p className="text-red-800">Oh no! Something went wrong.</p>
        )}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            {confirmation?.cancel || confirmationDefaults.cancel}
          </button>

          {status !== "error" && (
            <button
              type="button"
              className={
                "btn btn-error hover:bg-red-600 bg-red-700 border-none rounded-lg text-white"
              }
              disabled={fetcher?.state !== "idle"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("🚀 | action", action, formData);
                fetcher.submit(formData, {
                  method: method,
                  action,
                });
              }}
            >
              {confirmation?.confirm || confirmationDefaults.confirm}
            </button>
          )}
        </div>
      </>
    </Modal>
  );
}

export function ConfirmationButton({
  className = "",
  formData,
  action,
  children,
  confirmation,
  startOpen,
  as = "button",
  method = "post",
  ...rest
}: ConfirmationButtonProps) {
  let modal = Modal.useModal(startOpen);
  let Component = as;
  return (
    <ConfirmationModal
      {...modal}
      method={method}
      confirmation={confirmation}
      action={action}
      formData={formData}
      trigger={
        <Component className={className} type="button" {...rest}>
          {children}
        </Component>
      }
    ></ConfirmationModal>
  );
}
