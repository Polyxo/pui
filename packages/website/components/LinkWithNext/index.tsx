import { Link } from "@progressiveui/react";
import NextLink from "next/link";
import React from "react";

// Define the props your LinkWithNext component accepts
interface LinkWithNextProps {
  children: React.ReactNode;
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
}

// Define the component
const LinkWithNext: React.FC<LinkWithNextProps> = ({
  children,
  href,
  as,
  replace,
  scroll,
  ...props
}) => {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      passHref
      legacyBehavior
      {...props}
    >
      <Link>{children}</Link>
    </NextLink>
  );
};

export default LinkWithNext;
