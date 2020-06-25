import React from "react";
import "./buttons.scss";

// export function Button({ children, ...rest }) {
//   return <button {...rest}>{children}</button>;
// }

export const Button: any = React.forwardRef((props, ref) => {
  let { children, ...rest } = props as any;
  return (
    <button ref={ref as any} {...rest}>
      {children}
    </button>
  );
});
