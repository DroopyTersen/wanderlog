import dayjs from "dayjs";
import {
  ActionFunction,
  redirect,
  useFetcher,
  useParams,
} from "react-router-dom";
import { MemoriesDisplay } from "~/features/memories/Memories";
import { memoryService, useMemories } from "~/features/memories/memory.service";
import { MemoryDto } from "~/features/memories/memory.types";

export default function DayMemoriesLayout() {
  let { tripId, date } = useParams();
  let memories = useMemories(tripId + "", date + "") || [];
  let deleteFetcher = useFetcher();

  const deleteMemory = (memory: MemoryDto) => {
    deleteFetcher.submit(
      {
        memoryId: memory.id,
      },
      {
        action: `/trips/${tripId}/${date}/memories`,
        method: "delete",
      }
    );
  };

  if (!memories.length) {
  }
  return (
    <div className="bg-primary-700 p-2 rounded-lg mt-2 shadow max-w-xl">
      {memories?.length ? (
        <MemoriesDisplay
          memories={memories}
          onDelete={deleteMemory}
          getEditUrl={(m) => `/trips/${tripId}/${date}/memories/${m.id}/edit`}
        />
      ) : (
        <div className="text-sm p-4 font-medium text-center text-gray-300">
          No one has added any memories for{" "}
          <b>{dayjs(date).format("MM/DD/YYYY")}</b> yet.
        </div>
      )}
    </div>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  let formData = await request.formData();
  console.log(
    "🚀 | constaction:ActionFunction= | request",
    request.method,
    request.url
  );
  if (request.method === "DELETE") {
    let memoryId = formData.get("memoryId");
    console.log("🚀 | constaction:ActionFunction= | memoryId", memoryId);
    if (memoryId) {
      await memoryService.remove(memoryId + "");
    }
  }

  return redirect("/trips/" + params.tripId + "/" + params.date + "/memories");
};
