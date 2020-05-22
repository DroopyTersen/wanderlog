import React, { useState, useCallback } from "react";

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

export function FormActions({
  isValid,
  onSave = () => {},
  onCancel = () => window.history.back(),
}) {
  return (
    <div className="form-actions">
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className="btn-secondary" disabled={!isValid}>
        Save
      </button>
    </div>
  );
}
