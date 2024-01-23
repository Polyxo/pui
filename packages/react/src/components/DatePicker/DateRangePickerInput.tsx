import * as React from "react";
import useSettings from "../../hooks/useSettings";
import { ArrowRight, CalendarAltRegular } from "@wfp/icons-react";

export interface DateRangePickerInputProps {
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
}
export const DateRangePickerInput: React.FC<DateRangePickerInputProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  datePicker,
  fromProps = {},
  toProps = {},
}) => {
  const { prefix } = useSettings();
  const DatePicker = datePicker;
  if (!DatePicker) {
    return "Add a datepicker component";
  }
  return (
    <div className={`${prefix}--date-ranger-picker`}>
      <div className={`${prefix}--date-ranger-picker__input`}>
        <DatePicker
          selected={startDate}
          className={`${prefix}--input ${prefix}--date-ranger__input__start-date`}
          onChange={setStartDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          wrapperClassName={`${prefix}--date-picker__wrapper`}
          {...fromProps}
        />
        <CalendarAltRegular className={`${prefix}--date-ranger-picker__icon`} />
      </div>
      <ArrowRight className={`${prefix}--date-ranger-picker__arrow`} />
      <div className={`${prefix}--date-ranger-picker__input`}>
        <DatePicker
          selected={endDate}
          className={`${prefix}--input ${prefix}--date-ranger__input__start-date`}
          onChange={setEndDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          wrapperClassName={`${prefix}--date-picker__wrapper`}
          {...toProps}
        />
        <CalendarAltRegular className={`${prefix}--date-ranger-picker__icon`} />
      </div>
    </div>
  );
};

DateRangePickerInput.displayName = "DateRangePickerInput";
