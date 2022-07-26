import { ConfirmationButton, ConfirmationButtonProps } from "./ConfirmationButton";

export function DeleteButton(props: ConfirmationButtonProps) {
  return (
    <ConfirmationButton className="text-red-700 hover:bg-red-100 btn btn-ghost" {...props}>
      <i className="bi bi-trash"></i>
      <span className="ml-1">Delete</span>
    </ConfirmationButton>
  );
}
