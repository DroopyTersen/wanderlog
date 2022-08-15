import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { MotionGrid } from "~/components";
import { Button } from "~/components/inputs/buttons";
import { ContextMenu } from "~/components/surfaces/DropdownMenu";
import { auth } from "../auth/auth.client";
import { useAllUsers } from "../users/user.service";
import { MemoryDto } from "./memory.types";

interface Props {
  memories: MemoryDto[];
  className?: string;
  getEditUrl?: (memory: MemoryDto) => string;
  onDelete?: (memory: MemoryDto) => void;
}
let currentUserId = auth?.getCurrentUser()?.id;
export function MemoriesDisplay({
  memories = [],
  onDelete,
  getEditUrl,
  className = "",
  ...rest
}: Props) {
  let allUsers = useAllUsers();
  return (
    <MotionGrid
      width="600px"
      {...rest}
      gap="44px"
      className={"my-4" + className}
    >
      {memories?.map((memory) => {
        let createdBy = allUsers.find((user) => user.id === memory.createdById);
        return (
          <MotionGrid.Item key={memory.id}>
            <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 items-center">
              <div className="shadow-xl rounded-full w-6 overflow-hidden">
                <svg
                  className="h-full w-full bg-pink/80"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-sm text-pink">
                  {createdBy?.name || createdBy?.username}
                </div>
              </div>
              {currentUserId === memory.createdById && getEditUrl && onDelete && (
                <ContextMenu className="btn-ghost">
                  <ContextMenu.Item to={getEditUrl(memory)}>
                    <HiOutlinePencil /> Edit Memory
                  </ContextMenu.Item>
                  <ContextMenu.Item>
                    <Button
                      variants={["danger"]}
                      onClick={() => onDelete(memory)}
                    >
                      <HiOutlineTrash /> Delete Memory
                    </Button>
                  </ContextMenu.Item>
                </ContextMenu>
              )}
              <pre className="font-sans text-base col-start-2 col-span-2 text-white whitespace-pre-wrap">
                {memory.content}
              </pre>
            </div>
          </MotionGrid.Item>
        );
      })}
    </MotionGrid>
  );
}

export function MemoriesPreview({ memories, className = "", ...rest }) {
  let items =
    typeof memories === "string"
      ? memories.trim().split("\n").filter(Boolean)
      : memories;
  return (
    <div {...rest} className={"memories " + className}>
      {items?.map((item) => (
        <div key={item} className="truncate">
          {item}
        </div>
      ))}
    </div>
  );
}
