import { forwardRef, useMemo, useState } from "react";
import Select, { components, MultiValueGenericProps } from "react-select";
import CreatableSelect from "react-select/creatable";
import { useDebouncedEffect } from "~/hooks/useDebounce";
import { pickerStyles } from "./Picker.styles";
import { PickerMultiProps, PickerOption } from "./Picker.types";
import { useAutocompleteOptions } from "./useAutocompleteOptions";

const parseSelectedOptions = (
  values: PickerOption[] | string[],
  options?: PickerOption[]
) => {
  if (!values?.length) return [];
  if ((values?.[0] as PickerOption)?.value) return values as PickerOption[];
  return values
    .map((value) => {
      return (
        options?.find?.((o) => o.value === value) || { value, label: value }
      );
    })
    .filter(Boolean);
};

const PickerMulti = forwardRef<any, PickerMultiProps>(function PickerMulti(
  {
    initialValue,
    creatable,
    onChange,
    selectProps,
    options: optionsOrGetOptions,
    value,
    ...rest
  },
  ref
) {
  let isControlled = value !== undefined;
  let SelectComponent = creatable === true ? CreatableSelect : Select;
  let [selectedOptions, setSelectedOptions] = useState(() =>
    isControlled
      ? value
      : parseSelectedOptions(initialValue, optionsOrGetOptions as any[])
  );
  let [inputValue, setInputValue] = useState("");
  let [options, { isLoading }] = useAutocompleteOptions(
    inputValue,
    optionsOrGetOptions
  );

  useDebouncedEffect(
    () => {
      if (isControlled) return;

      onChange(selectedOptions);
    },
    selectedOptions,
    100
  );

  let optionsToShow = useMemo(() => {
    if (!options?.length) return selectedOptions || [];
    return options.filter(
      (o) => !selectedOptions.find((so) => so.value + "" === o.value + "")
    );
  }, [selectedOptions, options]);
  return (
    <SelectComponent
      styles={pickerStyles}
      components={{ MultiValueLabel }}
      ref={ref}
      {...rest}
      isLoading={isLoading}
      {...selectProps}
      classNamePrefix="dotadda-picker"
      onInputChange={(val) => {
        setInputValue(val);
      }}
      // If they pass a 'getOptions' function we'll assume that is responsible for filtering
      // the options. If they pass an array of options we'll leverage the default filtering
      filterOption={
        typeof optionsOrGetOptions === "function" ? () => true : undefined
      }
      defaultValue={selectedOptions}
      onChange={(options: PickerOption[]) => {
        if (isControlled) {
          onChange(options);
        } else {
          setSelectedOptions(options);
        }
      }}
      isMulti={true}
      options={optionsToShow}
    />
  );
});

const MultiValueLabel = (props: MultiValueGenericProps) => {
  return (
    <div className="inline-flex items-center">
      <svg
        className="-ml-1 mr-1.5 h-2 w-2 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx={4} cy={4} r={3} />
      </svg>
      <components.MultiValueLabel {...props} />
    </div>
  );
};

export default PickerMulti;
