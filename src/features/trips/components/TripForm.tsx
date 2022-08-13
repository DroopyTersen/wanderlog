import { useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { Button } from "~/components/inputs/buttons";
import { FormField } from "~/components/inputs/FormField";
import { InputField } from "~/components/inputs/InputField";
import { PickerOption } from "~/components/inputs/picker";
import PickerMulti from "~/components/inputs/picker/PickerMulti";
import { auth } from "~/features/auth/auth.client";
import { User } from "~/features/users/user.types";
import { TripSaveInput } from "../trip.types";

interface TripFormProps {
  initial?: TripSaveInput;
  users: User[];
}

export function TripForm({ initial, users }: TripFormProps) {
  let startRef = useRef<HTMLInputElement>(null);
  let endRef = useRef<HTMLInputElement>(null);

  let [companions, setCompanions] = useState<{ userId: string | number }[]>(
    initial?.companions || [
      {
        userId: (auth?.getCurrentUser() as User).id,
      },
    ]
  );

  const companionOptions: PickerOption[] = users.map((u) => ({
    label: `${u.name} | (${u.username})`,
    value: u.id + "",
  }));

  let navigate = useNavigate();
  return (
    <Form method="post">
      <fieldset className="flex flex-col gap-4">
        <input type="hidden" name="id" value={initial?.id} />
        {companions.map((c) => (
          <input
            key={c.userId}
            type="hidden"
            name="companions"
            value={c.userId}
          />
        ))}
        <InputField
          label="Title"
          name="title"
          required
          defaultValue={initial?.title}
        />
        <InputField
          label="Destination"
          name="destination"
          required
          defaultValue={initial?.destination}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            ref={startRef}
            label="Start date"
            name="start"
            type="date"
            required
            onInput={(e) => {
              console.log(e.currentTarget.value);
            }}
            onBlur={(e) => {
              let startInput = e.currentTarget;
              let endInput = e.currentTarget
                .closest(".form-field")
                ?.nextElementSibling?.querySelector(
                  "input"
                ) as HTMLInputElement;
              handleStartBlur(startInput, endInput);
            }}
            defaultValue={initial?.start}
          />
          <InputField
            ref={endRef}
            label="End date"
            name="end"
            required
            type="date"
            defaultValue={initial?.end}
          />
        </div>
        <FormField label="Companions" name="companions">
          <PickerMulti
            onChange={(options = []) => {
              setCompanions(options.map(({ value }) => ({ userId: value })));
            }}
            initialValue={
              companions
                .map((c) =>
                  companionOptions.find((co) => co?.value === c.userId + "")
                )
                .filter(Boolean) as PickerOption[]
            }
            options={companionOptions}
          />
        </FormField>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            className="btn-ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button className="rounded-md" variants={["primary"]}>
            Save Trip
          </Button>
        </div>
      </fieldset>
    </Form>
  );
}

const handleStartBlur = (start: HTMLInputElement, end: HTMLInputElement) => {
  // if no end date OR start is greater than end
  // set end to start and focus end
  if (!end.value || start.value > end.value) {
    end.value = start.value;
    end.focus();
    (end as any)?.showPicker();
  }
};
