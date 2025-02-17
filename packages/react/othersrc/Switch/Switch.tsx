/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react";
import classNames from "classnames";
import useSettings from "../../src/hooks/useSettings";

interface SwitchProps extends React.ComponentPropsWithRef<"a"> {
  className?: string;
  index?: number;
  kind: "button" | "anchor";
  name?: string | number;
  onClick?: (
    e?: Event,
    index?: number,
    name?: string | number,
    text?: string
  ) => void;
  onKeyDown: (
    e?: Event,
    index?: number,
    name?: string | number,
    text?: string
  ) => void;
  selected?: boolean;
  text: string;
  icon?: React.ReactElement;
  href: string;
}

const Switch: React.FC<SwitchProps> = (props) => {
  const { prefix } = useSettings();
  const {
    className,
    index,
    kind,
    name,
    onClick = () => {},
    onKeyDown = () => {},
    selected,
    text,
    icon,
    href,
    ...other
  } = props;

  const handleClick = (e) => {
    e.preventDefault();
    // ({ index, name, text }) => onClick(index, name, text);
    onClick(e, index, name, text);
  };

  const handleKeyDown = (e) => {
    const key = e.key || e.which;

    if (key === "Enter" || key === 13 || key === " " || key === 32) {
      //   ({ index, name, text }) => onKeyDown(index, name, text);
      onKeyDown(e, index, name, text);
    }
  };

  const classes = classNames(className, `${prefix}--content-switcher-btn`, {
    [`${prefix}--content-switcher--selected`]: selected,
  });

  const commonProps = {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    className: classes,
  };

  const btnIcon = icon
    ? React.cloneElement(icon, {
        className: classNames(
          icon.props.className,
          `${prefix}--content-switcher__icon`
        ),
      })
    : null;

  if (kind === "button") {
    return (
      <button {...other} {...commonProps}>
        {btnIcon}
        {text}
      </button>
    );
  }

  return (
    <a href={href} {...other} {...commonProps}>
      {btnIcon}
      {text}
    </a>
  );
};

Switch.displayName = "Switch";

export default Switch;
