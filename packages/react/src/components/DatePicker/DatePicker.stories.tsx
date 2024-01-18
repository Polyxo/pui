import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import markdown from "./README.mdx";
import { DatePickerInput } from "./DatePickerInput";
import { DateRangePickerInput } from "./DateRangePickerInput";
import ReactDatePicker from "react-datepicker";
import DatePicker from "./DatePicker";
import DateRangePicker from "./DateRangePicker";

const meta: Meta<typeof DateRangePickerInput> = {
  title: "Components/UI Elements/DatePicker",
  component: DateRangePickerInput,
  tags: ["autodocs"],
  parameters: {
    componentSubtitle: "Component",
    status: "released",
    mdx: markdown,
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePickerInput>;

export const DatePickerDefault: Story = {
  render: (args) => <DatePicker datePicker={ReactDatePicker} {...args} />,
  args: {
    labelText: "DatePicker",
    helperText: "This is the helperText",
  },
};

export const DatePickerDefaultInput: Story = {
  render: (args) => <DatePickerInput {...args} datePicker={ReactDatePicker} />,
};

export const DateRangePickerDefault: Story = {
  render: (args) => (
    <DateRangePicker
      labelText="DateRangePicker"
      helperText="This is the helperText"
      {...args}
      datePicker={ReactDatePicker}
    />
  ),
};

export const DateRangePickerDefaultInput: Story = {
  render: (args) => (
    <DateRangePickerInput {...args} datePicker={ReactDatePicker} />
  ),
};
