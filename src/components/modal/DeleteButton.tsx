import {
  ConfirmationButton,
  ConfirmationButtonProps,
} from "./ConfirmationButton";

export function DeleteButton(props: ConfirmationButtonProps) {
  return (
    <ConfirmationButton
      method="delete"
      className="text-red-200 hover:bg-red-800 btn btn-ghost"
      {...props}
    >
      <i className="bi bi-trash"></i>
      <span className="ml-1">Delete</span>
    </ConfirmationButton>
  );
}
