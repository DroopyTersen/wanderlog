import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  // eslint-disable-next-line
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} {...rest} className={getInputClasses(className)} />;
  }
);

export type InputProps = React.HTMLProps<HTMLInputElement> & {
  className?: string;
};

export const getInputClasses = (className) =>
  [
    "block w-full mt-1 px-4",
    "text-base",
    "rounded-lg shadow-sm",
    "px-3 py-2",
    "disabled:cursor-not-allowed disabled:bg-gray-100",
    "bg-primary-700/80",
    // "invalid:ring-1 invalid:ring-red-500 invalid:border-red-500",
    "focus:outline-none border-2 border-transparent focus:border-pink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
