import React from "react";
import Credits from ".";
import markdown from "./README.mdx";

export default {
  title: "Components/UI Elements/Credits",
  component: Credits,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
    mdx: markdown,
  },
  /*argTypes: {
      children: { control: 'text' },
    },*/
};

export const CreditsDefault: Story = {
  render: (args) => (
    <Credits {...args}>
      <img
        alt="Default illustration"
        src="http://www1.wfp.org/sites/default/files/images/hp_yem_20170717_wfp-reem_nada_0109_3.jpg"
      />
    </Credits>
  ),
  args: {
    info: "Photo: WFP/ Rein Skullerud",
  },
};
