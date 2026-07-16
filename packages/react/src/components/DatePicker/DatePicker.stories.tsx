import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import markdown from "./README.mdx?raw";
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
type DatePickerStory = StoryObj<typeof DatePicker>;
type DatePickerInputStory = StoryObj<typeof DatePickerInput>;
type DateRangePickerStory = StoryObj<typeof DateRangePicker>;
type DateRangePickerInputStory = StoryObj<typeof DateRangePickerInput>;

export const DatePickerDefault: DatePickerStory = {
  render: (args) => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);

    return (
      <DatePicker
        datePicker={ReactDatePicker}
        {...args}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  },
  args: {
    labelText: "DatePicker",
    helperText: "This is the helperText",
  },
};

export const DatePickerDefaultInput: DatePickerInputStory = {
  render: (args) => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);

    return (
      <DatePickerInput
        {...args}
        datePicker={ReactDatePicker}
        startDate={startDate}
        setStartDate={setStartDate}
      />
    );
  },
};

export const DateRangePickerDefault: DateRangePickerStory = {
  render: (args) => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);

    return (
      <DateRangePicker
        labelText="DateRangePicker"
        helperText="This is the helperText"
        {...args}
        datePicker={ReactDatePicker}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    );
  },
};

export const DateRangePickerDefaultInput: DateRangePickerInputStory = {
  render: (args) => {
    const [startDate, setStartDate] = React.useState<Date | null>(null);
    const [endDate, setEndDate] = React.useState<Date | null>(null);

    return (
      <DateRangePickerInput
        {...args}
        datePicker={ReactDatePicker}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    );
  },
};
