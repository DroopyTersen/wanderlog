import dayjs from "dayjs";
import { Form } from "react-router-dom";
import { formatDateId } from "~/common/utils";
import { Button, LinkButton } from "~/components/inputs/buttons";
import { FormField } from "~/components/inputs/FormField";
import { InputField } from "~/components/inputs/InputField";
import { SelectField } from "~/components/inputs/SelectField";
import { TextArea } from "~/components/inputs/TextArea";

interface MemoryFormProps {
  tripId: string;
  date?: string;
  id?: string;
  tripDates?: Date[];
  content?: string;
}

export function MemoryForm({
  tripId,
  date,
  content = "",
  id = "",
  tripDates,
}: MemoryFormProps) {
  return (
    <Form method="post" className="flex flex-col gap-4">
      <input type="hidden" value={tripId} name="tripId"></input>
      <input type="hidden" value={id} name="id"></input>
      {date && <input type="hidden" value={date} name="date"></input>}
      {!date && tripDates && (
        <SelectField name="date" label="Date" required>
          {tripDates.map((date, index) => (
            <option key={formatDateId(date)} value={formatDateId(date)}>
              <span className="font-bold">Day {index + 1}</span>:{" "}
              {dayjs(date).format("ddd MMM D, YYYY")}
            </option>
          ))}
        </SelectField>
      )}
      {!date && !tripDates?.length && (
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
