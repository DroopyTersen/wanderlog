import { BiBookHeart } from "react-icons/bi";
import { IoMdImages } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { DropdownMenu } from "~/components/surfaces/DropdownMenu";
import { NewMenu } from "~/features/layout/NewMenu/NewMenu";
import { delayedOpenFilePicker } from "~/features/photos/components/PhotoUploader";
import { TripDto } from "../../trip.types";

interface Props {
  trip: TripDto;
}

const checkShouldHide = (pathname: string) => {
  return pathname.includes("/memories/new");
};
export const TripNewMenu = ({ trip }: Props) => {
  let { pathname } = useLocation();
  let navigate = useNavigate();

  if (checkShouldHide(pathname)) return null;
  return (
    <NewMenu>
      <DropdownMenu.Item to={`/trips/${trip.id}/memories/new`}>
        <BiBookHeart />
        Add a Memory
      </DropdownMenu.Item>
      <DropdownMenu.Item
        onSelect={() => {
          delayedOpenFilePicker();
          navigate(`/trips/${trip.id}/photos`);
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
