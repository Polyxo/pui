import { List, ListItem } from "@progressiveui/react";
import React from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";

interface DoUseType {
  children: React.ReactNode;
  title?: string;
  kind?: "checkmark" | "cross";
  background: boolean;
}

export function DoUse({
  children,
  title = "When to use",
  kind = "checkmark",
  background = false,
}: DoUseType) {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childrenListItemWithProps = React.Children.map(
        child.props.children,
        (childListItem: { props: object }) => {
          if (React.isValidElement(childListItem)) {
            return React.createElement(ListItem, {
              ...childListItem.props,
              kind,
            });
          }
          return childListItem;
        }
      );
      return childrenListItemWithProps;
    }
    return child;
  });
  const classes = classNames(styles.doUseElement, {
    [styles.doUse]: kind === "checkmark" && background,
    [styles.doNotUse]: kind === "cross" && background,
  });

  return (
    <div className={classes}>
      <h3>{title}</h3>
      <List kind="bullets">{childrenWithProps}</List>
    </div>
  );
}

export function DoNotUse({ title = "When not to use", ...props }: any) {
  return <DoUse {...props} kind="cross" title={title} />;
}
