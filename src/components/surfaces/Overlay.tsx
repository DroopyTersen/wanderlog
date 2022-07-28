interface Props {
  className?: string;
  children: React.ReactNode;
  opacity?: number;
}

export function Overlay({ className = "", children, opacity = 0.85 }: Props) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center ${
        opacity === 0 ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={"absolute inset-0 z-50 " + className}
        style={{ opacity: opacity + "" }}
      ></div>
      <div className="z-50">{children}</div>
    </div>
  );
}
