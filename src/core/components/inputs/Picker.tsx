import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useDebouncedEffect } from "core/hooks/useDebounce";

const colors = {
  /*
   * multiValue(remove)/color:hover
   */
  danger: "var(--error)",

  /*
   * multiValue(remove)/backgroundColor(focused)
   * multiValue(remove)/backgroundColor:hover
   */
  dangerLight: "transparent",

  /*
   * control/backgroundColor
   * menu/backgroundColor
   * option/color(selected)
   */
  neutral0: "var(--popupBackground)",

  /*
   * control/backgroundColor(disabled)
   */
  neutral5: "green",

  /*
   * control/borderColor(disabled)
   * multiValue/backgroundColor
   * indicators(separator)/backgroundColor(disabled)
   */
  neutral10: "var(--neutral-700)",

  /*
   * control/borderColor
   * option/color(disabled)
   * indicators/color
   * indicators(separator)/backgroundColor
   * indicators(loading)/color
   */
  neutral20: "var(--white)",

  /*
   * control/borderColor(focused)
   * control/borderColor:hover
   */
  neutral30: "var(--pink-500)",

  /*
   * menu(notice)/color
   * singleValue/color(disabled)
   * indicators/color:hover
   */
  neutral40: "var(--gold-500)",

  /*
   * placeholder/color
   */
  neutral50: "var(--neutral-200)",

  /*
   * indicators/color(focused)
   * indicators(loading)/color(focused)
   */
  neutral60: "var(--white)",
  neutral70: "var(--white)",

  /*
   * input/color
   * multiValue(label)/color
   * singleValue/color
   * indicators/color(focused)
   * indicators/color:hover(focused)
   */
  neutral80: "var(--white)",

  neutral90: "var(--white)",

  /*
   * control/boxShadow(focused)
   * control/borderColor(focused)
   * control/borderColor:hover(focused)
   * option/backgroundColor(selected)
   * option/backgroundColor:active(selected)
   */
  primary: "var(--pink-500)",

  /*
   * option/backgroundColor(focused)
   */
  primary25: "var(--gold-300)",

  /*
   * option/backgroundColor:active
   */
  primary50: "var(--gold-400",

  // multivalue clear hover
  primary75: "var(--error)",
};

export function PickerSingle(props: PickerSingleProps) {
  let SelectComponent = props.creatable === true ? CreatableSelect : Select;
  let [selected, setSelected] = useState(props.value || "");

  useDebouncedEffect(
    () => {
      props.onChange(selected);
    },
    selected,
    150
  );

  return (
    <SelectComponent
      className="react-select"
      classNamePrefix="react-select"
      value={
        props.options.find((o) => o.value === selected) || { value: selected, label: selected }
      }
      isDisabled={props.isDisabled}
      onChange={(option) => setSelected(option.value)}
      options={props.options}
      name={name}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          ...colors,
        },
      })}
    />
  );
}

export function PickerMulti(props: PickerMultiProps) {
  let SelectComponent = props.creatable === true ? CreatableSelect : Select;
  let [selected, setSelected] = useState<PickerOption[]>(() => {
    return (props.value as any)
      .map((val) => props.options.find((o) => o.value === val))
      .filter(Boolean);
  });

  useDebouncedEffect(
    () => {
      props.onChange(selected);
    },
    selected,
    300
  );

  return (
    <SelectComponent
      className="react-select"
      classNamePrefix="react-select"
      value={selected}
      onChange={(options) => {
        console.log("OPTIONS", options);
        setSelected(options || []);
      }}
      options={props.options}
      isMulti={true}
      isDisabled={props.isDisabled}
      isClearable={true}
      theme={(theme) => ({
        ...theme,
        borderRadius: "5px",
        colors: {
          ...theme.colors,
          ...colors,
        },
      })}
    />
  );
}

export interface PickerOption {
  value: string | number;
  label: string;
  __isNew__?: boolean;
}

export interface PickerProps {
  creatable?: boolean;
  options: PickerOption[];
  required?: boolean;
  isDisabled?: boolean;
}

export interface PickerSingleProps extends PickerProps {
  value: string;
  onChange: (newValue: string | number) => void;
}
export interface PickerMultiProps extends PickerProps {
  value: string[] | number[];
  onChange: (newOptions: PickerOption[]) => void;
}
