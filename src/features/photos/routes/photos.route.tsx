import { useLoaderData } from "react-router-dom";
import { AppBackgroundLayout } from "~/features/layout/AppBackground/AppBackgroundLayout";
import { DesktopPageTitle } from "~/features/layout/DesktopPageTitle";
import { PhotoGrid } from "../components/PhotoGrid";
import { photoService } from "../photo.service";
import { PhotoDto } from "../photo.types";

export default function () {
  let { allPhotos } = useLoaderData() as { allPhotos: PhotoDto[] };

  return (
    <AppBackgroundLayout title="Photos">
      <DesktopPageTitle>Photos</DesktopPageTitle>
      <PhotoGrid photos={allPhotos} />{" "}
    </AppBackgroundLayout>
  );
}
export const loader = async () => {
  let allPhotos = await photoService.getAll();
  return {
    allPhotos,
  };
};
