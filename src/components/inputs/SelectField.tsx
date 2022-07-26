import { forwardRef } from "react";
import { FormField, FormFieldProps, pluckFormFieldProps } from "./FormField";
import { Select, SelectProps } from "./Select";

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  // eslint-disable-next-line
  function SelectField(props, ref) {
    const { formControlProps, formFieldProps } = pluckFormFieldProps(props);
    return (
      <FormField {...formFieldProps}>
        <Select {...formControlProps} ref={ref} />
      </FormField>
    );
  }
);

export type SelectFieldProps = SelectProps & FormFieldProps;
