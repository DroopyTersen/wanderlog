import { forwardRef } from "react";
import { FormField, FormFieldProps, pluckFormFieldProps } from "./FormField";
import { TextArea, TextAreaProps } from "./TextArea";

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  // eslint-disable-next-line
  function TextAreaField(props, ref) {
    const { formControlProps, formFieldProps } = pluckFormFieldProps(props);
    return (
      <FormField {...formFieldProps}>
        <TextArea {...formControlProps} ref={ref} />
      </FormField>
    );
  }
);

export type TextAreaFieldProps = TextAreaProps & FormFieldProps;
