import { motion } from "framer-motion";
import { HiOutlineFingerPrint } from "react-icons/hi";
import { LinkButton } from "~/components/inputs/buttons";
import { auth } from "../auth/auth.client";
import { NewMenu } from "../layout/NewMenu/NewMenu";
import "./home.scss";
let currentUser = auth.getCurrentUser();
export default function HomeRoute() {
  // let trips = useTrips();
  // let tripPhotos = (useLoaderData() as any)?.tripPhotos as any;
  return (
    <>
      <motion.div
        className="home content centered"
        initial={{ opacity: 0, scale: 0.95, y: -15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline text-neutral-200 font-medium">
          Lust less. Remember more.
        </h3>
      </motion.div>
      {/* {currentUser && tripPhotos && (
        <div className="w-full max-w-lg">
          <CarouselSlider>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                {...trip}
                photos={[tripPhotos[trip.id]].filter(Boolean)}
              />
            ))}
          </CarouselSlider>
        </div>
      )} */}
      {currentUser && (
        <div className="grid place-items-center p-4 justify-center gap-3 fixed bottom-[200px] right-0 left-0 md:relative md:bottom-0 md:mt-12">
          <LinkButton
            to="/trips"
            className="btn btn-primary btn-outline text-gold-800 bg-primary-700/40 w-44"
          >
            My Trips
          </LinkButton>
          <LinkButton
            to="/photos"
            className="btn btn-primary btn-outline  bg-primary-700/40 w-44 text-shadowed"
          >
            My Photos
          </LinkButton>
        </div>
      )}
      {currentUser ? (
        <NewMenu />
      ) : (
        <div className="fab-container">
          <LinkButton to="/login" variants={["primary"]}>
            <HiOutlineFingerPrint size={17}></HiOutlineFingerPrint>
            Sign In
          </LinkButton>
        </div>
      )}
    </>
  );
}

// export const loader: LoaderFunction = async () => {
//   let tripPhotos = await tripService.getRandomPhotoForEachTrip();

//   return {
//     tripPhotos,
//   };
// };
