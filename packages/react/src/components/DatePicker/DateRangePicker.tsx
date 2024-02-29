import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import Input from "../Input/Input";
import { UseInputProps, useInput } from "../Input/useInput";
import { InputProps } from "../Input";
import {
  DateRangePickerInput,
  DateRangePickerInputProps,
} from "./DateRangePickerInput";

/** DatePicker with the Input wrapper */

interface DateRangePickerProps
  extends InputProps,
    DateRangePickerInputProps,
    React.ComponentPropsWithRef<"input"> {}

const DateRangePicker: React.FC<DateRangePickerProps> = React.forwardRef(
  (props, ref) => {
    const {
      fromProps,
      toProps,
      hideLabel,
      helperText,
      /* pattern, */ required,
    } = props;

    const { prefix } = useSettings();

    const inputClassName = classNames(
      `${prefix}--input`,
      `${prefix}--date-range-picker`,
      {
        [`${prefix}--date-range-picker--helpertext`]: helperText,
        [`${prefix}--date-range-picker--nolabel`]: hideLabel,
        [`${prefix}--date-range-picker--required`]: required,
      }
    );

    const useInputProps = props as UseInputProps;
    const { inputProps, wrapperProps } = useInput({
      ...useInputProps,
      inputClassName,
    });

    return (
      <Input {...wrapperProps}>
        <DateRangePickerInput
          // pattern={pattern}
          {...inputProps}
          ref={ref}
          fromProps={fromProps}
          toProps={toProps}
        />
      </Input>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";

export default DateRangePicker;
