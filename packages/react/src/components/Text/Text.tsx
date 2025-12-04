import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";
import { Spacing, TextKind } from "../../utils";

interface TextProps extends React.AllHTMLAttributes<HTMLDivElement> {
  /**
   * Overrides the rendered HTML tag or React component.
   */
  as?: React.ElementType;
  /**
   * Specifies the kind of text to be displayed. This could be an enumeration that defines various text styles or types.
   */
  kind?: TextKind;

  /**
   * The content of the Text component, typically a string or nested React elements.
   */
  children?: React.ReactNode;

  /**
   * Spacing to be applied above the Text component. 'Spacing' could be a type that represents predefined spacing values.
   */
  spacingTop?: Spacing;

  /**
   * Spacing to be applied below the Text component. Similar to spacingTop, it uses the Spacing type for predefined values.
   */
  spacingBottom?: Spacing;

  /**
   * Additional custom class name(s) that can be applied to the Text component for styling purposes.
   */
  className?: string;
}

export const textLookup: {
  [key in NonNullable<TextProps["kind"]>]: React.ElementType;
} = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  title: "h1",
  subtitle: "h3",
  p: "p",
  caption: "div",
  code: "code",
  sup: "sup",
  i: "i",
  bold: "b",
  strong: "strong",
  a: "a",
  "inline-highlight": "code",
  "story-subtitle": "h2",
  "story-title": "h1",
};

/**
 *Text is a component for displaying paragraphs. You can use Text to standardize text across your web app. For longer sections or full articles use the <Story /> component instead.
 */

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      as: asProp,
      children,
      className,
      kind,
      spacingTop,
      spacingBottom,
      ...rest
    },
    ref,
  ) => {
    const { prefix } = useSettings();
    const fallbackTag = undefined;
    const TagName: React.ElementType = asProp || "div";

    const classes = classNames(
      `${prefix}--text`,
      kind && `${prefix}--text__${kind}`,
      spacingTop && `${prefix}--text__spacing-top-${spacingTop}`,
      spacingBottom && `${prefix}--text__spacing-bottom-${spacingBottom}`,
      className,
    );

    return (
      <TagName ref={ref} className={classes} {...rest}>
        {children}
      </TagName>
    );
  },
);

Text.displayName = "Text";

export default Text;
