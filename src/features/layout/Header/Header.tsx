import { IoMdArrowBack } from "react-icons/io";
import { LinkButton } from "~/components/inputs/buttons";

interface HeaderProps {
  children: React.ReactNode;
  back: string;
}

export function Header({ children, back }: HeaderProps) {
  return (
    <header className="lg:hidden z-10 box-content h-11 right-0 left-0 fixed bg-primary-700 grid grid-cols-[1fr_auto_1fr] pt-[var(--safeContentTop)] -mt-[var(--safeContentTop)]">
      <LinkButton to={back} className="btn-ghost" variants={["circle"]}>
        <IoMdArrowBack size={20} />
      </LinkButton>
      <h1 className="text-center text-3xl leading-10">{children}</h1>
    </header>
  );
}
