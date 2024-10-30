import React from "react";
import markdown from "./README.mdx";
import Input from ".";

export default {
  title: "Components/Forms/Input",
  component: Input,
  parameters: {
    componentSubtitle: "Component",
    status: "experimental",
    mdx: markdown,
  },
};

export const InputDefault: Story = {
  render: (args) => (
    <Input {...args}>
      <input placeholder="This can be any type of custom input" />
    </Input>
  ),
  args: {
    name: "inputname",
    helperText: "Optional helperText",
    labelText: "The labelText",
  },
};

const inputsourcecode = `
import { Input  } from "@progressiveui/react";

<Input
  helperText="Optional helperText"
  labelText="The labelText"
  name="inputname"
>
{() => <input placeholder="This can be any type of custom input" />}
</Input>
`;

InputDefault.story = {
  parameters: {
    docs: {
      source: {
        code: inputsourcecode,
      },
    },
  },
};
