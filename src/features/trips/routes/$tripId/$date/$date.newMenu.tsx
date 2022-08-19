import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu } from "~/components/surfaces/DropdownMenu";
import { NewMenu } from "~/features/layout/NewMenu/NewMenu";
import { delayedOpenFilePicker } from "~/features/photos/components/PhotoUploader";

interface Props {
  tripId: string;
  date: string;
}

const checkShouldHide = (pathname: string) => {
  return pathname.endsWith("/new") || pathname.endsWith("/edit");
};
export const DateNewMenu = ({ tripId, date }: Props) => {
  let { pathname } = useLocation();
  let navigate = useNavigate();

  if (checkShouldHide(pathname)) return null;
  return (
    <NewMenu>
      <DropdownMenu.Item to={`/trips/${tripId}/${date}/memories/new`}>
        <BiBookHeart />
        Add a Memory
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onSelect={() => {
          delayedOpenFilePicker();
          navigate(`/trips/${tripId}/${date}/photos`);
        }}
      >
        <a>
          <IoMdImages />
          Add Photos
        </a>
      </DropdownMenu.Item>
    </NewMenu>
  );
};
