import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Controller } from "react-hook-form";
import PasswordInput from ".";
import reactHookFormDecorator from "../../../.storybook/reactHookFormDecorator";

const meta: Meta<typeof PasswordInput> = {
  title: "Components/Forms/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    componentSubtitle: "Component",
    status: "released",
  },
  args: {
    id: "account-password",
    name: "password",
    labelText: "Password",
    helperText: "Use at least 8 characters",
    showPasswordLabelText: "Show password",
    hidePasswordLabelText: "Hide password",
  },
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

export const PasswordInputDefault: Story = {};

export const WithError: Story = {
  args: {
    invalid: { message: "Please enter your password" },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helperText: "This field is locked",
  },
};

export const CustomToggleLabels: Story = {
  args: {
    showPasswordLabelText: "Reveal",
    hidePasswordLabelText: "Conceal",
  },
};

export const WithAddonAfter: Story = {
  args: {
    addonAfter: <span style={{ fontSize: "0.75rem" }}>caps lock on</span>,
  },
};

export const WithReactHookForm: Story = {
  render: (args, context) => {
    const form = (context as { form?: any }).form;

    if (!form?.register) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <PasswordInput {...args} {...form.register("password")} />
        <Controller
          render={({ field }) => (
            <PasswordInput
              {...field}
              labelText="Confirm password"
              helperText="Repeat the password to confirm"
            />
          )}
          control={form.control}
          name="confirmPassword"
        />
      </>
    );
  },
  args: {
    helperText: "Password managed by React Hook Form",
  },
  decorators: [reactHookFormDecorator],
};
