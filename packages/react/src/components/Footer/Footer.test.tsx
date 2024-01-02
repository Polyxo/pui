import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

// Mocking the useSettings hook
jest.mock("../../hooks/useSettings", () => ({
  __esModule: true,
  default: jest.fn(() => ({ prefix: "mocked-prefix" })),
}));

describe("Footer component", () => {
  it("renders with default props", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    // Use a more semantic query like getByRole("contentinfo")
    // You can adjust this based on the actual role or landmark role of your footer
    // Add more assertions as needed
  });

  it("renders with custom labels and links", () => {
    render(
      <Footer
        labelOne="Label One"
        linkTextOne="Link One"
        linkHrefOne="/link-one"
        labelTwo="Label Two"
        linkTextTwo="Link Two"
        linkHrefTwo="/link-two"
      />
    );
    expect(screen.getByText("Label One")).toBeInTheDocument();
    expect(screen.getByText("Link One")).toHaveAttribute("href", "/link-one");
    expect(screen.getByText("Label Two")).toBeInTheDocument();
    expect(screen.getByText("Link Two")).toHaveAttribute("href", "/link-two");
  });

  it("renders with custom logos", () => {
    render(
      <Footer
        logo="path-to-logo.png"
        logoExtended="path-to-extended-logo.png"
      />
    );
    expect(
      screen.getByAltText("World Food Programme Logo")
    ).toBeInTheDocument();
    expect(screen.getByAltText("WFP Logo")).toBeInTheDocument();
  });

  it("renders with meta content and links", () => {
    render(
      <Footer
        metaContent={<span>Copyright 2023</span>}
        metaLinks={<a href="/privacy">Privacy Policy</a>}
      />
    );
    expect(screen.getByText("Copyright 2023")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toHaveAttribute(
      "href",
      "/privacy"
    );
    // Add more assertions as needed
  });
});
