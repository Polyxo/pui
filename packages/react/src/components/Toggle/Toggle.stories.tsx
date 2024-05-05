import * as React from "react";
import Toggle from ".";

export default {
  title: "Components/UI Elements/Toggle",
  component: Toggle,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
  },
};

export const ToggleDefault: Story = {
  render: (args) => <Toggle {...args} />,
  args: {
    defaultToggled: false,
    labelA: "Off",
    labelB: "On",
    name: "togglename",
  },
};
