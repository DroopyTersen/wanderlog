import { Form } from "react-router-dom";
import { Button, LinkButton } from "~/components/inputs/buttons";
import { FormField } from "~/components/inputs/FormField";
import { InputField } from "~/components/inputs/InputField";
import { TextArea } from "~/components/inputs/TextArea";
import { TripDayPicker } from "../trips/components/TripDayPicker";
import { TripDto } from "../trips/trip.types";

interface MemoryFormProps {
  trip: TripDto;
  date?: string;
  id?: string;
  content?: string;
}

export function MemoryForm({
  trip,
  date,
  content = "",
  id = "",
}: MemoryFormProps) {
  return (
    <Form method="post" className="flex flex-col gap-4">
      <input type="hidden" value={trip?.id} name="tripId"></input>
      <input type="hidden" value={id} name="id"></input>
      {date && <input type="hidden" value={date} name="date"></input>}
      {!date && trip && (
        <TripDayPicker
          trip={trip}
          name="date"
          label="Date"
          required
          autoFocus
        />
      )}
      {!date && !trip && (
        <InputField type="date" label="Date" name="date" defaultValue={date} />
      )}
      <FormField label="Memory" required name="content">
        <TextArea
          autoFocus
          name="content"
          rows={6}
          required
          defaultValue={content}
          className="h-32"
          placeholder="Describe something that happened on this day..."
        />
      </FormField>
      <div className="flex items-center justify-end gap-2">
        <LinkButton to=".." className="btn-ghost rounded-lg">
          Cancel
        </LinkButton>
        <Button className="rounded-md" variants={["primary"]}>
          Save Memory
        </Button>
      </div>
    </Form>
  );
}
