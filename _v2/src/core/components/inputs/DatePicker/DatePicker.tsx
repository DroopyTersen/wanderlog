import { useDisableBodyScroll } from "core/hooks/useDisableBodyScroll";
import * as React from "react";
import { Calendar } from "./Calendar";
import {
  useCalendarNavigation,
  useDatePickerDropdown,
  useDatePickerEvents,
  useDatePickerInput,
} from "./calendar.hooks";

import "./DatePicker.css";
import { formatValue } from "./datepicker.utils";

interface DatePickerOptions {
  /** The dayjs format string */
  dropdownMode?: "alwaysOpen" | "closeOnSelect";
  getDayClass?: (date: string) => string;
  checkEnabled?: (date: string) => boolean;
}
const defaultOptions: DatePickerOptions = {
  dropdownMode: "closeOnSelect",
  getDayClass: () => "",
  checkEnabled: () => true,
};

interface Props {
  value: string;
  onChange: (string) => void;
  options?: DatePickerOptions;
  [key: string]: any;
}

function DatePickerOverlay({ isShowing, setIsOpen }) {
  useDisableBodyScroll(isShowing);

  return (
    <div
      className={`datepicker__theme datepicker__overlay datepicker__overlay--${
        isShowing ? "visible" : "hidden"
      }`}
    >
      <button
        className="datepicker__overlay-close-button"
        type="button"
        onClick={() => setIsOpen(false)}
      >
        CLOSE
      </button>
    </div>
  );
}
let TODAY = formatValue(new Date());

export function DatePicker({ value, onChange, options, ...props }: Props) {
  let opts = { ...defaultOptions, ...options };
  let { activeDate, actions } = useCalendarNavigation(value || TODAY, onChange, opts.checkEnabled);

  // TEXT INPUT
  let [inputValue, setInputValue] = useDatePickerInput(value, actions.setActiveDate);

  // Dropdown Management
  let { setIsOpen, isDropdownShowing, containerProps } = useDatePickerDropdown(
    value,
    opts.dropdownMode
  );

  // Keyboard and Focus management
  let { events, isKeyboarding } = useDatePickerEvents({
    activeDate,
    setIsOpen,
    actions,
    containerRef: containerProps.ref,
  });

  return (
    <>
      <DatePickerOverlay
        isShowing={isDropdownShowing && opts.dropdownMode === "closeOnSelect"}
        setIsOpen={setIsOpen}
      />

      <div
        {...containerProps}
        {...events}
        className={`datepicker__theme datepicker datepicker--${
          isDropdownShowing ? "open" : "closed"
        } datepicker--${opts.dropdownMode}`}
        tabIndex={isDropdownShowing ? -1 : undefined}
      >
        <div className="datepicker__input-container">
          <input
            className="datepicker__input"
            type="text"
            placeholder="Date..."
            {...props}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        {isDropdownShowing && (
          <div className={`datepicker__dropdown datepicker__dropdown--${opts.dropdownMode}`}>
            <Calendar
              activeDate={activeDate}
              onSelect={actions.selectDate}
              getDayClass={(day) =>
                [
                  opts.getDayClass(day),
                  day === value ? "calendar__day--selected" : "",
                  opts.checkEnabled(day) ? "" : "calendar__day--disabled",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
              prevMonth={actions.prevMonth}
              nextMonth={actions.nextMonth}
              options={{ displayActive: isKeyboarding }}
            />
          </div>
        )}
      </div>
    </>
  );
}
