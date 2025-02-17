import React, { useState } from "react";
import markdown from "./README.mdx";
import Search from ".";
import Button from "../Button";

export default {
  title: "Components/UI Elements/Search",
  component: Search,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
    mdx: markdown,
  },
};

export const SearchDefault: Story = {
  render: (args) => <Search {...args} />,
  args: {
    name: "search",
    placeholder: "search here",
  },
};

export const SearchWithButton = (args) => (
  <div style={{ width: "50%", display: "flex" }}>
    <Search {...args} addonAfter={<div>AddonAfter</div>} />
    <Button kind="primary" style={{ margin: "0 0.5rem" }}>
      Apply search
    </Button>
  </div>
);

SearchWithButton.args = {
  name: "search",
  id: "butonsearch",
};

const AddonBefore = () => {
  return <div>Before</div>;
};

const AddonAfter = () => {
  return <div>After</div>;
};

export const SearchWithComponents = (args) => {
  const [value, setValue] = useState("");
  return (
    <div style={{ width: "50%", display: "flex" }}>
      <Search
        onChange={(evt) => {
          setValue(evt.target.value);
        }}
        {...args}
        components={{ AddonBefore, AddonAfter }}
      />
      <Button kind="primary" style={{ margin: "0 0.5rem" }}>
        Apply search
      </Button>
    </div>
  );
};

SearchWithButton.story = {
  parameters: {
    docs: {
      storyDescription: `You can add a button to initate search action`,
    },
  },
};

export const SmallSearch = (args) => <Search {...args} />;

SmallSearch.args = {
  kind: "small",
  id: "smallsearch",
};

SmallSearch.story = {
  parameters: {
    docs: {
      storyDescription: `There are diffent ways to render the \`Search\` input by changing the \`kind\` prop.`,
    },
  },
};

export const RoundedSearch = (args) => <Search {...args} />;
RoundedSearch.args = {
  id: "roundedsearch",
  rounded: true,
};
RoundedSearch.story = {
  parameters: {
    docs: {
      storyDescription: `You can make the search input rounded by adding the prop \`rounded\``,
    },
  },
};

export const MainNavigationSearch = (args) => <Search {...args} />;

MainNavigationSearch.args = {
  kind: "main",
};

MainNavigationSearch.story = {
  parameters: {
    docs: {
      storyDescription: `The Search input for the mainnavigation`,
    },
  },
};
