import dayjs from "dayjs";
import {
  ActionFunction,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getDaysInRange } from "~/common/utils";
import { BigDate, Modal } from "~/components";
import { memoryService, useMemories } from "~/features/memories/memory.service";
import { memorySaveSchema } from "~/features/memories/memory.types";
import { MemoryForm } from "~/features/memories/MemoryForm";
import { useTrip } from "~/features/trips/trip.service";

export default function MemoryFormRoute() {
  let { tripId, date, memoryId } = useParams();
  let trip = useTrip(tripId + "");
  let tripDates = getDaysInRange(trip?.start, trip?.end);
  let memories = useMemories(tripId + "", date + "");
  let intialMemory = memories?.find((m) => m.id === memoryId);
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
          {date && <BigDate date={date + ""} variant="day-date-month" />}
          {trip?.title && (
            <div className="flex items-center gap-1">
              {date && (
                <span className="day-count font-bold">
                  Day {dayjs(date).diff(dayjs(trip.start), "day") + 1}:
                </span>
              )}
              <div className="text-pink brightness-125">{trip.title}</div>
            </div>
          )}
        </div>
      }
      closeOnClickOutside={false}
    >
      <MemoryForm
        tripId={tripId + ""}
        tripDates={tripDates}
        date={date}
        {...intialMemory}
      />
    </Modal>
  );
}

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let saveInput = memorySaveSchema.parse(Object.fromEntries(formData));
  console.log("🚀 | constaction:ActionFunction= | saveInput", saveInput);
  if (saveInput.id) {
    await memoryService.update(saveInput);
  } else {
    await memoryService.insert(saveInput);
  }
  return redirect(`/trips/${saveInput.tripId}/${saveInput.date}/memories`);
};
