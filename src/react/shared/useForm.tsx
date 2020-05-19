import { useState, useCallback } from "react";

export function useForm<T>(initial: T, onSubmit: (formData: T) => void) {
  let [formData, setFormData] = useState(initial);

  let update = useCallback(
    (key, value) => {
      setFormData((formData) => ({
        ...formData,
        [key]: value,
      }));
    },
    [setFormData]
  );

  let handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    props: {
      onSubmit: handleSubmit,
    },
    data: formData,
    update,
  };
}
