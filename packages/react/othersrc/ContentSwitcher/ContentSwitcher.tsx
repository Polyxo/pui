import React, { useState } from "react";
import classNames from "classnames";
import useSettings from "../../src/hooks/useSettings";

/** ContentSwitcher manipulates the content shown following an exclusive or “either/or” pattern. It is used to toggle between two or more content sections within the same space on screen. Only one section can be shown at a time.
 */

interface ContentSwitcherProps extends React.ComponentPropsWithRef<"div"> {
  /* The Selected index of the ContentSwitcher */
  selectedIndex?: number;
  /* Small variant of the ContentSwitcher */
  small?: boolean;
  /* Callback function to be called when the selected index is changed */
  onChange: (data?: object) => void;
}

const ContentSwitcher: ContentSwitcherProps = ({
  children,
  className,
  selectedIndex,
  small,
  onChange,
  ...other
}) => {
  const { prefix } = useSettings();
  const [selectedIdx, setSelectedIndex] = useState(selectedIndex);

  const getChildren = (children) => {
    return React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        index,
        onClick: handleChildChange,
        onKeyDown: handleChildChange,
        selected: index === selectedIdx,
      })
    );
  };

  const handleChildChange = (data) => {
    const { index } = data;
    if (selectedIdx !== index) {
      setSelectedIndex(index);
      onChange(data);
    }
  };

  const classes = classNames(`${prefix}--content-switcher`, className, {
    [`${prefix}--content-switcher--sm`]: small,
  });

  return (
    <div {...other} className={classes}>
      {getChildren(children)}
    </div>
  );
};

export default ContentSwitcher;
