/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import Input, { InputProps } from "../Input";
import useInput, { UseInputProps } from "../Input/useInput";

interface NumberInputProps
  extends InputProps,
    Omit<React.ComponentPropsWithRef<"input">, "onChange" | "value"> {
  /**
   * The maximum value.
   */
  max?: string | number;
  /**
   * The minimum value.
   */
  min?: string | number;
  /**
   * Specify how much the valus should increase/decrease upon clicking on up/down button
   */
  step?: number;
  /**
   * `true` to allow empty string.
   */
  allowEmpty?: boolean;
  /**
   * Specify if the control should be disabled, or not
   */
  disabled?: boolean;
  /**
   * Specify a custom `id` for the input
   */
  id?: string;
  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText?: string;
  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel?: boolean;
  /**
   * Specify whether you want the up/down buttons to be hidden
   */
  hideControls?: boolean;
  /**
   * `true` to use the light version.
   */
  light?: boolean;
  /**
   * Specify the regular expression that the value should match using the html pattern attribute
   */
  pattern?: string;
  /**
   * The new value is available in 'imaginaryTarget.value'
   * i.e. to get the value: evt.imaginaryTarget.value or in th second argument provided to the onChange prop
   */
  onChange?: (
    evt?: React.ChangeEvent | any,
    value?: number,
    direction?: string
  ) => void;
  /**
   * Provide an optional function to be called when the up/down button is clicked
   */
  onClick?: (
    evt?: React.MouseEvent,
    value?: number,
    direction?: string
  ) => void;
  /**
   * Specify the value of the input, if undefined or null the value is empty
   */
  value?: "" | number | string;
}

const countDecimals = (value: string) => {
  const valueFloat = parseFloat(value);
  if (Math.floor(valueFloat) === valueFloat) return 0;
  return value.split(".")[1].length || 0;
};

const capMin = (min, value) =>
  isNaN(min) || (!min && min !== 0) || isNaN(value) || (!value && value !== 0)
    ? value
    : Math.max(min, value);
const capMax = (max, value) =>
  isNaN(max) || (!max && max !== 0) || isNaN(value) || (!value && value !== 0)
    ? value
    : Math.min(max, value);

/** The number input component is used for entering numeric values and includes controls for incrementally increasing or decreasing the value */

const NumberInput: React.FC<NumberInputProps> = React.forwardRef(
  (props, ref) => {
    const {
      className,
      disabled,
      id,
      hideLabel,
      hideControls,
      max,
      min,
      step = 1,
      onChange = () => {},
      onClick = () => {},
      helperText,
      light,
      //allowEmpty,
      pattern = "[0-9]*",
      // ...other
    } = props;
    const { prefix } = useSettings();

    const initialValue = capMax(max, capMin(min, props.value));
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
      setValue(props.value);
    }, [props.value]);

    const newInputRef = useRef<HTMLInputElement>(null);
    const _inputRef = ref ? ref : newInputRef;

    const handleChange = (evt) => {
      if (!disabled) {
        evt.persist();
        evt.imaginaryTarget = _inputRef;

        setValue(evt.target.value);
        onChange(evt, parseFloat(evt.target.value));
      }
    };

    const handleArrowClick = (evt, direction) => {
      let valueState = typeof value === "string" ? Number(value) : value;
      valueState = isNaN(valueState) ? 0 : valueState;

      const conditional =
        direction === "down"
          ? (min !== undefined && valueState > min) || min === undefined
          : (max !== undefined && valueState < max) || max === undefined;

      const stepString = step.toString();
      valueState =
        direction === "down"
          ? valueState - step
          : valueState + parseFloat(stepString);
      valueState = capMax(max, capMin(min, valueState));
      valueState = parseFloat(valueState.toFixed(countDecimals(stepString)));

      if (!disabled && conditional) {
        evt.persist();
        evt.imaginaryTarget = _inputRef;
        evt.target.value = parseFloat(valueState);
        onClick(evt, direction);
        setValue(valueState);
        onChange(evt, valueState, direction);
      }
    };

    const numberInputClasses = classNames(`${prefix}--number`, className, {
      [`${prefix}--number--light`]: light,
      [`${prefix}--number--helpertext`]: helperText,
      [`${prefix}--number--nolabel`]: hideLabel,
      [`${prefix}--number--nocontrols`]: hideControls,
    });

    const newProps = {
      disabled,
      id,
      max,
      min,
      step,
      onChange: handleChange,
      value: value,
    };

    const useInputProps = props as UseInputProps;
    const { inputProps, wrapperProps } = useInput({
      ...useInputProps,
      type: "number",
    });

    return (
      <Input {...wrapperProps} inputWrapperClassName={numberInputClasses}>
        <div className={`${prefix}--number__controls`}>
          <button
            className={`${prefix}--number__control-btn up-icon`}
            type="button"
            disabled={disabled}
            onClick={(evt) => handleArrowClick(evt, "up")}
          >
            +
          </button>
          <button
            className={`${prefix}--number__control-btn down-icon`}
            type="button"
            disabled={disabled}
            onClick={(evt) => handleArrowClick(evt, "down")}
          >
            −
          </button>
          <input pattern={pattern} {...inputProps} {...newProps} ref={ref} />
        </div>
      </Input>
    );
  }
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
