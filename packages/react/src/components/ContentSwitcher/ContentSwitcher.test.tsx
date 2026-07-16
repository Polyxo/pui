import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Switch from "../../../othersrc/Switch";
import ContentSwitcher from "./ContentSwitcher";

describe("ContentSwitcher", () => {
  const renderContentSwitcher = (onChange = jest.fn()) => {
    render(
      <ContentSwitcher onChange={onChange}>
        <Switch kind="button" name="one" text="First section" />
        <Switch kind="button" name="two" text="Second section" />
      </ContentSwitcher>,
    );

    return { onChange };
  };

  it("selects the first switch by default", () => {
    renderContentSwitcher();

    expect(screen.getByRole("button", { name: "First section" })).toHaveClass(
      "wfp--content-switcher--selected",
    );
    expect(
      screen.getByRole("button", { name: "Second section" }),
    ).not.toHaveClass("wfp--content-switcher--selected");
  });

  it("selects a clicked switch and reports the established change payload", async () => {
    const user = userEvent.setup();
    const { onChange } = renderContentSwitcher();
    const first = screen.getByRole("button", { name: "First section" });
    const second = screen.getByRole("button", { name: "Second section" });

    await user.click(second);

    expect(first).not.toHaveClass("wfp--content-switcher--selected");
    expect(second).toHaveClass("wfp--content-switcher--selected");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      index: 1,
      name: "two",
      text: "Second section",
    });
  });

  it("selects a switch with the keyboard and reports the same payload", async () => {
    const user = userEvent.setup();
    const { onChange } = renderContentSwitcher();
    const second = screen.getByRole("button", { name: "Second section" });

    second.focus();
    await user.keyboard("{Enter}");

    expect(second).toHaveClass("wfp--content-switcher--selected");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      index: 1,
      name: "two",
      text: "Second section",
    });
  });
});
