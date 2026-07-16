import * as React from "react";
import useSettings from "../../hooks/useSettings";
import { ArrowRight, CalendarAltRegular } from "@progressiveui/icons-react";

export interface DatePickerInputProps {
  /**
   * The starting date value. React DatePicker adapters use `Date | null`;
   * formatted strings remain accepted for compatibility with custom adapters.
   */
  startDate?: string | Date | null;

  /**
   * The ending date value. React DatePicker adapters use `Date | null`;
   * formatted strings remain accepted for compatibility with custom adapters.
   */
  endDate?: string | Date | null;

  /**
   * The DatePicker component to be used (react-datepicker by default)
   */
  datePicker?: React.ComponentType<any>;

  /**
   * Function to set the starting date. The string alternative is retained only
   * for compatibility with the previous declaration and is not a valid handler.
   */
  setStartDate?: string | ((date: Date | null, event?: unknown) => void);

  /**
   * Function to set the ending date. The string alternative is retained only
   * for compatibility with the previous declaration and is not a valid handler.
   */
  setEndDate?: string | ((date: Date | null, event?: unknown) => void);

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
    ref,
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
  },
);

DatePickerInput.displayName = "DatePickerInput";
