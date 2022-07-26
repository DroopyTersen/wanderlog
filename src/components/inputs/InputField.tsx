import { forwardRef } from "react";
import { FormField, FormFieldProps, pluckFormFieldProps } from "./FormField";
import { Input, InputProps } from "./Input";

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  // eslint-disable-next-line
  function InputField(props, ref) {
    const { formControlProps, formFieldProps } = pluckFormFieldProps(props);
    return (
      <FormField {...formFieldProps}>
        <Input required={formFieldProps.required} {...formControlProps} ref={ref} />
      </FormField>
    );
  }
);

export type InputFieldProps = InputProps & FormFieldProps;
