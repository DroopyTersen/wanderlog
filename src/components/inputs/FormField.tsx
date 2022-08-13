import { getClassName } from "~/common/utils";
export type ValidationStatus = "none" | "valid" | "invalid";
interface FieldError {
  message: string;
  type: string;
}
export const FormField = ({
  name,
  label,
  validationStatus,
  className,
  error,
  required,
  children,
  hint,
}: FormFieldProps) => {
  const errorMsg = parseErrorMessage(error, label);
  const status = getValidationStatus(validationStatus, errorMsg);
  const cssClass = getClassName(["form-field", status, className]);
  return (
    <div className={cssClass}>
      {label && (
        <label className="mb-1 text-gray-300" htmlFor={name}>
          {label}
          {required && <span className="ml-[2px] text-red-400">*</span>}
        </label>
      )}
      {children}
      {errorMsg && status === "invalid" && (
        <div className="mt-1 text-sm text-red-400" id="email-error">
          {errorMsg}
        </div>
      )}
      {hint && (
        <div className="mt-1 text-sm text-gray-400" id="email-description">
          {hint}
        </div>
      )}
    </div>
  );
};

export interface FormFieldProps {
  /** The input name */
  name: string;
  /** The field label */
  label?: string;
  /** Helper text */
  hint?: string;
  /** The React Hook Form error */
  error?: FieldError | string;
  /** JSX that contains an input element with a matching name. */
  children?: React.ReactNode;
  /** Optionally pass an explicit validation status */
  validationStatus?: ValidationStatus;
  /** Show the little red asterisk? */
  required?: boolean;
  /** Additional CSS classes to add */
  className?: string;
}

export const pluckFormFieldProps = (props: any) => {
  const {
    name,
    label,
    validationStatus,
    error,
    required,
    hint,
    className,
    id,
    ...formControlProps
  } = props;

  return {
    formFieldProps: {
      name,
      label,
      validationStatus,
      error,
      required,
      hint,
      className,
    },

    formControlProps: {
      name,
      id: id || name,
      ...formControlProps,
    },
  };
};

export const getValidationStatus = (
  validationStatus: ValidationStatus,
  error: FieldError | string
) => {
  let status = validationStatus;
  if (!status && error) {
    status = "invalid";
  }

  return status;
};

export const parseErrorMessage = (error: FieldError | string, label) => {
  if (!error) return "";
  if (typeof error === "string") return error;

  if (error.message) return error.message;

  if (error.type === "required") return `${label || "Field"} is required`;
  return `${label || "Field"} error: ${error.type}`;
};
