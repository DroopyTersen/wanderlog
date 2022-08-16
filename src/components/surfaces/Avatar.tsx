interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  if (!name) return null;
  return (
    <div className="avatar placeholder pr-2 items-center gap-2 bg-pink/80 text-primary-700 rounded-full text-sm font-medium">
      <div className="shadow-xl rounded-full w-8">
        <svg
          className="h-full w-full bg-pink"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>

      <span className="w-[120] truncate">{name}</span>
    </div>
  );
}
export const AvatarInitialsStack = ({ names }: { names: string[] }) => {
  return (
    <div className="avatar-group -space-x-2">
      {names.filter(Boolean).map((name) => (
        <AvatarInitials name={name} key={name} />
      ))}
    </div>
  );
};

export const AvatarInitials = ({ name }: { name: string }) => {
  let initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="avatar placeholder border-none shadow-md" title={name}>
      <div className="bg-pink text-primary-700/90 rounded-full w-8 border border-gray-200/50">
        <svg
          className="h-full w-full text-pink brightness-125 opacity-60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span className="text-sm text-shadow font-medium absolute inset-0 grid place-items-center">
          {initials}
        </span>
      </div>
    </div>
  );
};
