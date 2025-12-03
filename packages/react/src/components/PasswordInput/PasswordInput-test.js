import React from "react";
import { mount } from "enzyme";
import PasswordInput from "../PasswordInput";

describe("PasswordInput", () => {
  it("renders a password input by default and toggles visibility", () => {
    const wrapper = mount(
      <PasswordInput id="password" labelText="Password" name="password" />,
    );

    const input = () => wrapper.find("input");
    const toggleButton = () =>
      wrapper.find("button.wfp--password-input__toggle");

    expect(input().props().type).toEqual("password");

    toggleButton().simulate("click");
    wrapper.update();

    expect(input().props().type).toEqual("text");

    toggleButton().simulate("click");
    wrapper.update();

    expect(input().props().type).toEqual("password");
  });

  it("disables the toggle when the input is disabled", () => {
    const wrapper = mount(
      <PasswordInput
        id="password"
        labelText="Password"
        name="password"
        disabled
      />,
    );

    const input = () => wrapper.find("input");
    const toggleButton = () =>
      wrapper.find("button.wfp--password-input__toggle");

    expect(toggleButton().props().disabled).toBe(true);

    toggleButton().simulate("click");
    wrapper.update();

    expect(input().props().type).toEqual("password");
  });

  it("renders custom addon content before the toggle control", () => {
    const wrapper = mount(
      <PasswordInput
        id="password"
        labelText="Password"
        name="password"
        addonAfter={<span className="custom-addon">custom</span>}
      />,
    );

    const addonContainer = wrapper.find(".wfp--input-addon-after");

    expect(addonContainer.exists()).toBe(true);
    expect(addonContainer.find(".custom-addon").exists()).toBe(true);
    expect(
      addonContainer.find("button.wfp--password-input__toggle").exists(),
    ).toBe(true);
  });
});
