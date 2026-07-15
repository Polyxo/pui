import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import Input from "../Input/Input";
import { InputProps } from "../Input";
import { UseInputProps, useInput } from "../Input/useInput";

interface PasswordInputProps
  extends Omit<InputProps, "type">,
    Omit<React.ComponentPropsWithRef<"input">, "type"> {
  /**
   * Accessible label for the toggle when the password is hidden
   */
  showPasswordLabelText?: React.ReactNode;
  /**
   * Accessible label for the toggle when the password is visible
   */
  hidePasswordLabelText?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const {
      showPasswordLabelText = "Show password",
      hidePasswordLabelText = "Hide password",
      addonAfter,
      ...rest
    } = props;

    const { prefix } = useSettings();
    const [isVisible, setIsVisible] = React.useState(false);

    const { hideLabel, helperText, required, disabled, readOnly } = rest;

    const inputClassName = classNames(
      `${prefix}--input`,
      `${prefix}--text-input`,
      `${prefix}--password-input`,
      {
        [`${prefix}--text--helpertext`]: helperText,
        [`${prefix}--text--nolabel`]: hideLabel,
        [`${prefix}--text--required`]: required,
      },
    );

    const toggleButtonLabel = isVisible
      ? hidePasswordLabelText
      : showPasswordLabelText;

    const handleToggle = () => {
      if (disabled || readOnly) return;
      setIsVisible((prev) => !prev);
    };

    const toggleButton = (
      <button
        type="button"
        className={`${prefix}--password-input__toggle`}
        onClick={handleToggle}
        aria-pressed={isVisible}
        aria-label={toggleButtonLabel as string}
        disabled={disabled || readOnly}
      >
        {toggleButtonLabel}
      </button>
    );

    const useInputProps = rest as UseInputProps;
    const { inputProps, wrapperProps } = useInput({
      ...useInputProps,
      type: isVisible ? "text" : "password",
      addonAfter: (
        <>
          {addonAfter}
          {toggleButton}
        </>
      ),
      inputClassName,
    });

    return (
      <Input {...wrapperProps}>
        <input {...inputProps} ref={ref} />
      </Input>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
