import React from "react";
import { getClassName } from "~/common/utils";

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  // eslint-disable-next-line
  function Radio({ children, value, className, ...rest }, ref) {
    const cssClass = getClassName(["form-check", "align-middle", className]);
    return (
      <div className={cssClass}>
        <input
          className="form-check-input"
          type="radio"
          id={value}
          value={value}
          ref={ref}
          {...rest}
        />
        <label className="cursor-pointer form-check-label" htmlFor={value}>
          {children}
        </label>
      </div>
    );
  }
);
export type RadioProps = React.HTMLProps<HTMLInputElement> & {
  value: string;
  children: React.ReactNode;
  className?: string;
};
