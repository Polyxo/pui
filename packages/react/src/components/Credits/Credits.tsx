import * as React from "react";
import classNames from "classnames";
import useSettings from "../../hooks/useSettings";

interface CreditsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
 Specifiy the info content
*/
  info?: React.ReactNode;
}

/** Credits are mostly used when a photo need a source attribution. */
const Credits: React.FC<CreditsProps> = ({
  children,
  className,
  info,
  ...other
}) => {
  const { prefix } = useSettings();
  const classes = classNames(`${prefix}--credits`, className);
  return (
    <div className={classes} {...other}>
      <div className={`${prefix}--credits__info`}>{info}</div>
      {children}
    </div>
  );
};

Credits.displayName = "Credits";

export default Credits;
