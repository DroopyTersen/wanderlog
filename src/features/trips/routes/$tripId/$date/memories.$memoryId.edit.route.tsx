import dayjs from "dayjs";
import {
  ActionFunction,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BigDate, Modal } from "~/components";
import { memoryService } from "~/features/memories/memory.service";
import { memorySaveSchema } from "~/features/memories/memory.types";
import { MemoryForm } from "~/features/memories/MemoryForm";
import { useTrip } from "~/features/trips/trip.service";

export default function NewMemoryRoute() {
  let { tripId, date } = useParams();
  let trip = useTrip(tripId + "");
  let navigate = useNavigate();
  return (
    <Modal
      isOpen={true}
      setIsOpen={(isOpen) => {
        if (!isOpen) {
          navigate("..");
        }
      }}
      title={
        <div className="font-sans text-white mb-4">
          <BigDate date={date + ""} variant="day-date-month" />
          {trip?.title && (
            <div className="flex items-center gap-1">
              <span className="day-count font-bold">
                Day {dayjs(date).diff(dayjs(trip.start), "day") + 1}:
              </span>
              <div className="text-pink brightness-125">{trip.title}</div>
            </div>
          )}
        </div>
      }
      closeOnClickOutside={false}
    >
      <MemoryForm tripId={tripId + ""} date={date} />
    </Modal>
  );
}

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let saveInput = memorySaveSchema.parse(Object.fromEntries(formData));
  console.log("🚀 | constaction:ActionFunction= | saveInput", saveInput);
  await memoryService.insert(saveInput);

  return redirect(`/trips/${saveInput.tripId}/${saveInput.date}/memories`);
};
