import { HiPlus } from "react-icons/hi";
import { Button } from "~/components/inputs/buttons";
import { DropdownMenu } from "~/components/surfaces/DropdownMenu";

let ENTITIES = {
  trip: {
    label: "New Trip",
    route: "/trips/new",
  },
  dailyLog: {
    label: "New Daily Log",
    route: "/daily-logs/new",
  },
  location: {
    label: "New Location",
    route: "/locations/new",
  },
};
type EntityType = keyof typeof ENTITIES;
let allEntities = Object.keys(ENTITIES) as EntityType[];

interface NewMenuProps {
  entities?: EntityType[];
  children?: React.ReactNode;
}

export function NewMenu({ entities = allEntities, children }: NewMenuProps) {
  // TODO figure out if we are in the context of a trip and up
  return (
    <div className="fab-container">
      <DropdownMenu
        label={
          <Button title="Team actions menu" variants={["primary"]}>
            <HiPlus size={18} />
            <span>New</span>
          </Button>
        }
      >
        {children
          ? children
          : entities.map((entity) => {
              let { label, route } = ENTITIES[entity];
              return (
                <DropdownMenu.Item
                  key={entity}
                  className="min-w-[200px]"
                  to={route}
                >
                  {label}
                </DropdownMenu.Item>
              );
            })}
      </DropdownMenu>
    </div>
  );
}
