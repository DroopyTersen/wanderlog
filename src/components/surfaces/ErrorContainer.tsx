import { MdErrorOutline } from "react-icons/md";
import { useIsOnline } from "~/common/isOnline";
import { auth } from "~/features/auth/auth.client";
import { Button } from "../inputs/buttons";
export const ErrorContainer = ({
  title = "",
  children = undefined,
  className = "",
}: ErrorContainerProps) => {
  let isOnline = useIsOnline();
  return (
    <div
      className={
        "flex flex-col items-center p-4 b bg-red-700/60 text-red-50 font-medium text-center rounded-lg" +
        className
      }
    >
      <div className="text-red-100">
        <MdErrorOutline size={45} />
      </div>
      {title && <h3 className="my-2 text-2xl text-gray-100">{title}</h3>}
      {children}
      <div className="flex gap-2 mt-4">
        <Button
          className="btn-ghost"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </Button>
        {isOnline && (
          <Button
            className="btn-ghost"
            onClick={() => {
              auth.logout();
            }}
          >
            Restart App
          </Button>
        )}
      </div>
    </div>
  );
};

export interface ErrorContainerProps {
  /** The primary error message to display */
  title: string;
  /** Additional error details */
  children?: React.ReactNode;
  /** The icon name */
  icon?: string;
  className?: string;
}
