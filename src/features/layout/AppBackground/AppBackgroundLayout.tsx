import { Header } from "../Header/Header";
import { AppBackground } from "./AppBackground";

interface AppBackgroundLayoutProps {
  variant?: "blurred" | "sharp";
  children: React.ReactNode;
  title?: string;
  back?: string;
}

export function AppBackgroundLayout({
  children,
  variant = "blurred",
  title = "",
  back = "..",
}: AppBackgroundLayoutProps) {
  return (
    <>
      <AppBackground variant={variant} />
      <div className="pt-[var(--safeContentTop)] px-3 sm:px-4">
        {title && <Header back={back}>{title}</Header>}
        <div className={`${title ? "pt-11" : ""}`}>{children}</div>
      </div>
    </>
  );
}
