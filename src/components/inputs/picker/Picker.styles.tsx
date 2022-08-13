import type { StylesConfig } from "react-select";

export const pickerStyles: StylesConfig = {
  control: (base, state) => ({
    ...base,
    // paddingLeft: "8px",
    // paddingRight: "8px",
    borderRadius: "8px",
    "&:hover": {
      borderColor: "var(--pink-500)",
    },
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: "#fff",
    borderColor: state.isFocused ? "var(--pink-500)" : "transparent",
    outline: "none",
    boxShadow: "none",
    borderWidth: "2px",
    // boxShadow: state.isFocused ? "0 0 0 0.25rem var(--primary)" : "none",
  }),
  input: (base) => ({
    ...base,
    color: "#fff",
    "&>input": {
      boxShadow: "none !important",
    },
  }),
  menu: (base) => ({
    ...base,
    background: "var(--popupBackground)",
    zIndex: 99,
  }),
  option: (base, state) => ({
    ...base,
    // color: state.isSelected ? "var(--primary-100)" : "var(--gray-800)",

    backgroundColor: state.isSelected
      ? "var(--gold-700)"
      : state.isFocused
      ? "var(--blue-300)"
      : base.backgroundColor,
    "&:active": {
      background: "var(--blue-400)",
    },
  }),
  multiValue: (base, state) => ({
    ...base,
    background: "var(--pink-500)",
    paddingLeft: "1rem",
    borderRadius: "50rem",
    display: "flex",
    gap: "1px",
    height: "36px",
    alignItems: "center",
    color: "var(--pink-900)",
  }),
  multiValueLabel: (base, state) => ({
    fontSize: ".9em",
    lineHeight: ".9em",
    color: "var(--pink-900)",
    fontWeight: 500,
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    borderRadius: "50rem",
    padding: ".5rem",
  }),
};
