import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import Tab from "./Tab";

const defaultProps: React.ComponentProps<typeof Tab> = {
  id: "tab",
  label: "firstTab",
  role: "presentation",
  tabIndex: 0,
  selected: false,
};

const getTabListItem = () => screen.getByRole("presentation");

describe("Tab", () => {
  it("renders its label and established CSS classes", () => {
    render(<Tab {...defaultProps} />);

    expect(getTabListItem()).toHaveClass("wfp--tabs__nav-item");
    expect(screen.getByRole("tab", { name: "firstTab" })).toHaveClass(
      "wfp--tabs__nav-link",
    );
  });

  it("marks a disabled tab with the established CSS class", () => {
    render(<Tab {...defaultProps} disabled />);

    expect(getTabListItem()).toHaveClass("wfp--tabs__nav-item--disabled");
  });

  it("keeps the list item presentational and exposes the link as a tab", () => {
    render(<Tab {...defaultProps} href="#" />);

    expect(getTabListItem()).toHaveAttribute("role", "presentation");
    expect(screen.getByRole("tab", { name: "firstTab" })).toBeInTheDocument();
  });

  it("uses the supplied href", () => {
    render(<Tab {...defaultProps} href="#other-content" />);

    expect(screen.getByRole("tab", { name: "firstTab" })).toHaveAttribute(
      "href",
      "#other-content",
    );
  });

  it("does not apply the selected class by default", () => {
    render(<Tab {...defaultProps} />);

    expect(getTabListItem()).not.toHaveClass("wfp--tabs__nav-item--selected");
  });

  it("applies the selected class and ARIA state when selected", () => {
    render(<Tab {...defaultProps} selected />);

    expect(getTabListItem()).toHaveClass("wfp--tabs__nav-item--selected");
    expect(screen.getByRole("tab", { name: "firstTab" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("calls both click handlers with the tab context", async () => {
    const user = userEvent.setup();
    const handleTabClick = jest.fn();
    const onClick = jest.fn();
    render(
      <Tab
        {...defaultProps}
        href="#"
        index={2}
        handleTabClick={handleTabClick}
        onClick={onClick}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "firstTab" }));

    expect(handleTabClick).toHaveBeenCalledWith(
      2,
      "firstTab",
      expect.any(Object),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
