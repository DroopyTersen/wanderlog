import type { StylesConfig } from "react-select";

export const pickerStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    "&:hover": {
      borderColor: "var(--primary)",
    },
    borderColor: state.isFocused ? "var(--primary)" : base.borderColor,
    // boxShadow: state.isFocused ? "0 0 0 0.25rem var(--primary)" : "none",
  }),
  input: (base) => ({
    ...base,
    "&>input": {
      boxShadow: "none !important",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 99,
  }),

  option: (base, state) => ({
    ...base,
    // color: state.isSelected ? "var(--primary-100)" : "var(--gray-800)",
    color: state.isSelected
      ? "var(--primary-100)"
      : state.isFocused
      ? "var(--primary-800)"
      : "var(--gray-800)",
    backgroundColor: state.isSelected
      ? "var(--primary-600)"
      : state.isFocused
      ? "var(--primary-200)"
      : base.backgroundColor,
    "&:active": {
      background: "var(--primary-200)",
    },
  }),
  multiValue: (base, state) => ({
    ...base,
    background: "var(--secondary-200)",
    paddingLeft: "1rem",
    borderRadius: "50rem",
    display: "flex",
    gap: "1px",
    alignItems: "center",
  }),
  multiValueLabel: (base, state) => ({
    fontSize: ".9em",
    lineHeight: ".9em",
    color: "var(--secondary-800)",
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    borderRadius: "50rem",
    padding: ".5rem",
    color: "var(--secondary-800)",
    "&:hover": {
      background: "var(--secondary-400)",
      color: "var(--secondary-800)",
    },
  }),
};
