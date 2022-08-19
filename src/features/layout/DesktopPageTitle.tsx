interface DesktopPageTitleProps {
  children: React.ReactNode;
}

export function DesktopPageTitle({ children }: DesktopPageTitleProps) {
  return (
    <div className="hidden lg:block">
      <h1 className="text-6xl leading-10 my-8">{children}</h1>
    </div>
  );
}
