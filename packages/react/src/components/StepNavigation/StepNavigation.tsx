import type { PropsWithChildren } from "react";
import React, { useState /*createRef */ } from "react";
import classNames from "classnames";

import useSettings from "../../hooks/useSettings";

/** Step Navigation provide indications to help users reach their destination from their current position */
interface StepNavigationProps {
  /**
   * Provide a className that is applied to the root <nav> component for the
   * <Tabs>
   */
  className?: string;
  /**
   * Specify whether the StepNavigation will be displayed small
   */
  small?: boolean;
  /**
   * Specify whether the StepNavigation will be displayed vertically
   */
  vertical?: boolean;
  /**
   * Specify whether the StepNavigation will be displayed inline
   */
  inline?: boolean;
  /**
   * By default, this value is "navigation". You can also provide an alternate
   * role if it makes sense from the accessibility-side
   */
  role: string;
  /**
   * Provide an optional handler that is called whenever the selection
   * changes. This method is called with the index of the tab that was
   * selected
   */
  onSelectionChange?: React.SetStateAction<number>;
  /**
   * Optionally provide an index for the currently selected <Tab>
   */
  selectedPage?: number;
}

function StepNavigation({
  children,
  inline,
  small,
  vertical,
  className,
  role,
}: //selectedPage,
// onSelectionChange,
StepNavigationProps) {
  const { prefix } = useSettings();
  const [dropdownHidden] = useState(true);
  // const [elRefs, setElRefs] = useState({});

  /*const getTabAt = (index) => {
    return elRefs[`tab${index}`] || React.Children.toArray(children)[index];
  };
*/
  const getTabs = () => {
    return React.Children.map(children, (tab) => tab);
  };

  //const arrLength = getTabs()?.length;

  /* React.useEffect(() => {
    // add or remove refs
    setElRefs((elRefs) =>
      Array(arrLength).map((_, i) => elRefs[i] || createRef())
    );
  }, [arrLength]);*/

  // const setTabAt = (index, tabRef) => {
  //   //setElRefs({ ...elRefs, [`tab${index}`]: tabRef });
  // };

  const handleTabClick = (onSelectionChange) => {
    return (index, label, evt) => {
      evt.preventDefault();
      selectTabAt(index, onSelectionChange);
    };
  };

  /*const handleTabAnchorFocus = (onSelectionChange) => {
    return (index) => {
      const tabCount = React.Children.count(children) - 1;
      let tabIndex = index;

      if (index < 0) {
        tabIndex = tabCount;
      } else if (index > tabCount) {
        tabIndex = 0;
      }

      const tab = getTabAt(tabIndex);

      if (tab) {
        selectTabAt(tabIndex, onSelectionChange);
        if (tab.tabAnchor) {
          tab.tabAnchor.focus();
        }
      }
    };
  };
*/
  // const handleDropdownClick = () => {
  //   setDropdownHidden(!dropdownHidden);
  // };

  const selectTabAt = (index, onSelectionChange) => {
    handleTabClick(index);
    if (typeof onSelectionChange === "function") {
      onSelectionChange(index);
    }
  };

  const tabsWithProps = getTabs(); /* TODO: Use hook ?.map(
    (tab: React.ReactElement<any>, index: number) => {
      const newTab = React.cloneElement(tab as React.ReactElement<any>, {
        index,
        selectedPage: selectedPage,
        handleTabClick: handleTabClick(onSelectionChange),
        handleTabAnchorFocus: handleTabAnchorFocus(onSelectionChange),
        ref: elRefs[index],
      });

      return newTab;
    }
  );*/

  const classes = {
    tabs: classNames(className, {
      [`${prefix}--step-navigation`]: true,
      [`${prefix}--step-navigation--vertical`]: vertical,
      [`${prefix}--step-navigation--small`]: small,
      [`${prefix}--step-navigation--regular`]: !small,
    }),
    tablist: classNames(`${prefix}--step-navigation__nav`, {
      [`${prefix}--step-navigation__nav--hidden`]: dropdownHidden,
      [`${prefix}--step-navigation__nav--inline`]: inline,
    }),
  };

  return (
    <>
      <nav className={classes.tabs} role={role}>
        <ul role="tablist" className={classes.tablist}>
          {tabsWithProps}
        </ul>
      </nav>
    </>
  );
}

export default StepNavigation;
