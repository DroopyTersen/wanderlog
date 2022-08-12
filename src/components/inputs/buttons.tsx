import { ComponentProps, forwardRef } from "react";
import { Link } from "react-router-dom";

const BASE_STYLES = `flex items-center gap-1 rounded-full btn h-11 min-h-0`;

const VARIANTS = {
  primary: `btn-primary hover:bg-gold-400 hover:border-gold-400`,
  blue: `btn-ghost bg-primary-700/40 backdrop-blur-lg hover:bg-primary-600/50`,
  circle: `btn-square h-11 w-11`,
};

type Variant = keyof typeof VARIANTS;

export type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  children: React.ReactNode;
  variants?: Variant[];
  as?: any;
  className?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line
  function Button(
    { children, className, variants = [], as = "button", ...rest },
    ref
  ) {
    let variantStyles = variants.map((v) => VARIANTS[v]).join(" ");

    let Elem: any = as;
    return (
      <Elem
        ref={ref}
        className={`${BASE_STYLES} ${variantStyles} ${className}`}
        {...(rest as any)}
      >
        {children}
      </Elem>
    );
  }
);

type LinkProps = ComponentProps<typeof Link> & {
  variants: Variant[];
};

export function LinkButton({
  children,
  className,
  variants = [],
  ...rest
}: LinkProps) {
  let variantStyles = variants.map((v) => VARIANTS[v]).join(" ");

  return (
    <Link
      className={`${BASE_STYLES} ${variantStyles} ${className}`}
      {...(rest as any)}
    >
      {children}
    </Link>
  );
}
