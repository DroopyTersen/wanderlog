import { formToObject } from "core/utils";
import { useRef } from "react";
import { useMutation } from "urql";

const INSERT_TRIP_MUTATION = `mutation insertTrip($object: trips_insert_input!) {
    newTrip: insert_trips_one(object: $object) {
      id
      created_at
      start
      end
      destination
      author_id
      tags {
        tag {
          name
          id
        }
      }
    }
}`;

export interface TripFormData {
  title: string;
  start: Date;
  end: Date;
  destination?: string;
  tagIds?: Number[];
}
export function useForm(save) {
  let formRef = useRef(null);
  let onSubmit = (e) => {
    if (formRef.current) {
      if (formRef.current.checkValidity()) {
        let data = formToObject(formRef.current) as TripFormData;
        save(data);
        e.preventDefault();
      } else {
        formRef.current.reportValidity();
      }
    }
  };

  let formProps = {
    ref: formRef,
    onSubmit,
  };

  return {
    formProps,
    submit: (e) => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event("submit"));
      }
    },
  };
}

export function useNewTrip() {
  let [result, saveTripMutation] = useMutation(INSERT_TRIP_MUTATION);
  const save = (formData: TripFormData) => {
    let { tagIds = [], ...formFields } = formData;
    let variables = {
      object: {
        ...formFields,
        tags: {
          data: tagIds.map((id) => {
            tag_id: id;
          }),
        },
      },
    };
    saveTripMutation(variables);
  };
  let { submit, formProps } = useForm(save);
  return {
    result,
    submit,
    formProps,
  };
}
