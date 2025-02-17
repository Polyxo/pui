import React from "react";
import markdown from "./README.mdx";
import Pagination from ".";

export default {
  title: "Components/UI Elements/Pagination",
  component: Pagination,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
    mdx: markdown,
  },
};

export const PaginationDefault: Story = {
  render: (args) => <Pagination {...args} />,
  args: {
    pageSizes: [5, 20],
    totalItems: 30,
    // onChange: () => {},
  },
};
