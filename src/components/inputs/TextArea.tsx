import { forwardRef } from "react";
import { getInputClasses } from "./Input";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  // eslint-disable-next-line
  function TextArea({ className, ...rest }, ref) {
    let { validationStatus, ...props } = rest as any;
    return <textarea ref={ref} {...props} className={getInputClasses(className)}></textarea>;
  }
);

export type TextAreaProps = React.HTMLProps<HTMLTextAreaElement> & {
  className?: string;
};
