import { AppBackground } from "./AppBackground";

interface AppBackgroundLayoutProps {
  variant?: "blurred" | "sharp";
  children: React.ReactNode;
  title?: string;
}

export function AppBackgroundLayout({
  children,
  variant = "blurred",
  title = "",
}: AppBackgroundLayoutProps) {
  return (
    <>
      <AppBackground variant={variant} />
      <div className="pt-[var(--safeContentTop)] px-2 sm:px-4">
        {title && <h1 className="app-title text-5xl my-4">{title}</h1>}

        {children}
      </div>
    </>
  );
}
