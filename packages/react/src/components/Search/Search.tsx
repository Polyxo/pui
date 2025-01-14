import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import Input, { InputProps, useInput } from "../Input";
import { Search as SearchIcon, Close } from "@progressiveui/icons-react";
import { UseInputProps } from "../Input/useInput";

interface SearchProps extends InputProps, React.ComponentPropsWithRef<"input"> {
  defaultValue?: string | number;
  /**
   * Specify an optional className to be applied to the form-item node
   */
  formItemClassName?: string;
  inputWrapperClassName?: string;
  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel?: boolean;
  children?: React.ReactNode | string;
  light?: boolean;
  /**
   * The text for the close Button
   */
  closeButtonLabelText?: string;
  //  placeholder?: string;
  /**
   * Specify if the control should be disabled, or not
   */
  disabled?: boolean;
  id?: string;
  hideControls?: boolean;
  /**
   * Specify a style for the search input
   */
  kind?: "large" | "small" | "main" | "light" | "banner";
  /**
   * The new value is available first arg 'searchValue' and evt object if needed is on second arg.
   * i.e.
   * const handleChange = (searchValue, evt) => {
   * console.log("searchValue", searchValue); // a string
   * console.log("evt", evt); // the whole event object
   * }
   */
  onChange?: (
    event?: React.ChangeEvent<HTMLInputElement>,
    value?: string
  ) => void;
  onSearchIconClick?: () => void;
  /**
   * `true` to use the small version of Search
   */
  small?: boolean;
  value?: string;
  className?: string;
  rounded?: boolean;
}

/** Search enables users to specify a word or a phrase to find relevant pieces of content without the use of navigation. */
const Search: React.FC<SearchProps> = React.forwardRef((props, ref) => {
  const { prefix } = useSettings();

  const {
    className,
    closeButtonLabelText,
    disabled,
    // id,
    hideLabel,
    hideControls,
    labelText,
    kind = "large",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSearchIconClick = () => {},
    helperText,
    light,
    rounded,
  } = props;

  const initialValue = props.value;
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const newInputRef = React.useRef<HTMLInputElement>(null);

  const _inputRef = ref ? ref : newInputRef;

  const handleChange = (evt) => {
    if (!disabled) {
      evt.persist();
      evt.imaginaryTarget = _inputRef;
      setValue(evt.target.value);
      onChange(evt, evt.target.value); //TODO: why are we passing evt as second arg
    }
  };

  const clearSearch = () => {
    setValue("");
    // setTimeout(() => {
    //   console.log("value", value);
    // }, 1000);
    onChange(evt, "");
  };

  const searchInputWrapperClasses = classNames(`${prefix}--number`, className, {
    [`${prefix}--number--light`]: light,
    [`${prefix}--number--helpertext`]: helperText,
    [`${prefix}--number--nolabel`]: hideLabel,
    [`${prefix}--number--nocontrols`]: hideControls,
    "wfp--search": true,
    "wfp--search--lg": kind === "large",
    "wfp--search--sm": kind === "small",
    "wfp--search--main": kind === "main",
    "wfp--search--banner": kind === "banner",
    "wfp--search--light": kind === "light",
  });

  /*const newProps = {
    disabled,
    id,
    onChange: handleChange,
    value: value,
  };*/

  const clearClasses = classNames({
    "wfp--search-close": true,
    "wfp--search-close--hidden": !value,
  });

  const searchInputClassName = classNames(
    `${prefix}--search-input`,
    className,
    {
      [`${prefix}--search-input--rounded`]: rounded,
    }
  );

  const useInputProps = props as UseInputProps;

  const { wrapperProps, inputProps } = useInput({
    ...useInputProps,
    onChange: handleChange,
    className: `${prefix}--search-input__wrapper`,
    inputClassName: searchInputClassName,
  });

  return (
    <Input {...wrapperProps} inputWrapperClassName={searchInputWrapperClasses}>
      <SearchIcon
        description={labelText}
        className={`${prefix}--search-magnifier-icon`}
        onClick={onSearchIconClick}
      />

      <input
        {...inputProps}
        ref={_inputRef as React.Ref<HTMLInputElement>}
        value={value}
      />
      <button
        className={clearClasses}
        onClick={clearSearch}
        type="button"
        aria-label={closeButtonLabelText}
      >
        <Close description={closeButtonLabelText} />
      </button>
    </Input>
  );
});

Search.displayName = "Search";

export default Search;
