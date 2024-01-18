import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import Input from "../Input/Input";
import { UseInputProps, useInput } from "../Input/useInput";
import { InputProps } from "../Input";
import { DatePickerInput, DatePickerInputProps } from "./DatePickerInput";

/** DatePicker with the Input wrapper */

interface DatePickerProps
  extends InputProps,
    DatePickerInputProps,
    React.ComponentPropsWithRef<"input"> {}

const DatePicker: React.FC<DatePickerProps> = React.forwardRef((props, ref) => {
  const { datePickerProps, hideLabel, helperText, pattern, required } = props;

  const { prefix } = useSettings();

  const inputClassName = classNames(
    `${prefix}--input`,
    `${prefix}--date-picker`,
    {
      [`${prefix}--date-picker--helpertext`]: helperText,
      [`${prefix}--date-picker--nolabel`]: hideLabel,
      [`${prefix}--date-picker--required`]: required,
    }
  );

  const useInputProps = props as UseInputProps;
  const { inputProps, wrapperProps } = useInput({
    ...useInputProps,
    inputClassName,
  });

  return (
    <Input {...wrapperProps}>
      <DatePickerInput
        pattern={pattern}
        {...inputProps}
        ref={ref}
        datePickerProps={datePickerProps}
      />
    </Input>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
