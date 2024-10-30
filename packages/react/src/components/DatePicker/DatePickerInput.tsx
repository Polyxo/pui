import * as React from "react";
import useSettings from "../../hooks/useSettings";
import { ArrowRight, CalendarAltRegular } from "@progressiveui/icons-react";

export interface DatePickerInputProps {
  /**
   * The starting date value, formatted as a string.
   */
  startDate?: string;

  /**
   * The ending date value, formatted as a string.
   */
  endDate?: string;

  /**
   * The DatePicker component to be used (react-datepicker by default)
   */
  datePicker?: React.ComponentType<any>;

  /**
   * Function to set the starting date. Typically used as an event handler.
   */
  setStartDate?: string;

  /**
   * Function to set the ending date. Typically used as an event handler.
   */
  setEndDate?: string;

  /**
   * Additional props for the start date DatePicker component.
   * Can be used to pass custom settings or event handlers.
   */
  fromProps?: object;

  /**
   * Additional props for the end date DatePicker component.
   * Can be used to pass custom settings or event handlers.
   */
  toProps?: object;
  /**
   * Additional props for the DatePicker component.
   */
  datePickerProps?: object;
}

export const DatePickerInput = React.forwardRef<
  HTMLInputElement,
  DatePickerInputProps
>(
  (
    { startDate, endDate, setStartDate, datePicker, datePickerProps = {} },
    ref
  ) => {
    const { prefix } = useSettings();
    const DatePicker = datePicker;
    if (!DatePicker) {
      return <div>Add a datepicker component</div>;
    }
    return (
      <div className={`${prefix}--date-picker`}>
        <div className={`${prefix}--date-picker__input`}>
          <DatePicker
            selected={startDate}
            className={`${prefix}--input ${prefix}--date__input__start-date`}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            wrapperClassName={`${prefix}--date-picker__wrapper`}
            {...datePickerProps}
            ref={ref}
          />
          <CalendarAltRegular className={`${prefix}--date-picker__icon`} />
        </div>
      </div>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";
