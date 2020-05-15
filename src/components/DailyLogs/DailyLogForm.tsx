import React from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

export default function DiaryForm() {
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      date: dayjs().format("YYYY-MM-DD"),
    },
  });
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="date"
        placeholder="Enter the date..."
        name="date"
        ref={register({ required: true })}
      />
      <textarea name="body" ref={register({ required: true })} />

      <input type="submit" />
    </form>
  );
}
