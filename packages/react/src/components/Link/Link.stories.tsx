import React from "react";
import Link from ".";

export default {
  title: "Components/UI Elements/Link",
  component: Link,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
  },
};

export const LinkDefault = (args) => <Link {...args} />;

LinkDefault.args = { children: "WFP Homepage", href: "https://www.wfp.org" };

export const States = (args) => (
  <>
    <Link {...args} className="wfp--link">
      :default
    </Link>
    <Link {...args} className="wfp--link--hover">
      :hover
    </Link>
    <Link {...args} className="wfp--link--focus">
      :focus
    </Link>
    <Link {...args} className="wfp--link--active">
      :active
    </Link>
    <Link {...args} className="wfp--link--visited">
      :visited
    </Link>
    <Link {...args} disabled>
      :disabled
    </Link>
  </>
);

States.args = { ...LinkDefault.args, style: { marginRight: "1rem" } };

States.story = {
  parameters: {
    docs: {
      storyDescription: `The link component only uses minimalistic styles to indicate different states. By default, the link component does not use a visited style. Visited links indicate that a user has already opened the link so they can be a helpful indicator during task completion. Visited styles should be used sparingly because they often clutter the the page and add further visual noise as users are trying to navigate a product. They can be used if it is important that a user knows they have already clicked on a link.
      `,
    },
  },
};

export const LinkSolid = (args) => (
  <div
    style={{
      width: "100%",
      height: "70px",
      backgroundColor: "#04193b",
      padding: "20px",
    }}
  >
    <Link {...args} className="wfp--link--solid">
      :default
    </Link>
    <Link {...args} className="wfp--link--solid--hover">
      :hover
    </Link>

    <Link {...args} className="wfp--link--solid--active">
      :active
    </Link>
    <Link {...args} className="wfp--link--solid--focus">
      :focus
    </Link>
    <Link {...args} className="wfp--link--solid--visited">
      :visited
    </Link>
    <Link {...args} className="wfp--link--solid" disabled>
      :disabled
    </Link>
  </div>
);

LinkSolid.args = {
  ...LinkDefault.args,
  linkSolid: true,
  style: { marginRight: "1rem" },
};

LinkSolid.story = {
  parameters: {
    docs: {
      storyDescription: `The link component only uses minimalistic styles to indicate different states. By default, the link component does not use a visited style. Visited links indicate that a user has already opened the link so they can be a helpful indicator during task completion. Visited styles should be used sparingly because they often clutter the the page and add further visual noise as users are trying to navigate a product. They can be used if it is important that a user knows they have already clicked on a link.
      `,
    },
  },
};
