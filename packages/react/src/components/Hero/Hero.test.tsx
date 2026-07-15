import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders content with its documented classes", () => {
    render(
      <Hero className="some-class" kind="landscape">
        A simple card
      </Hero>,
    );

    const card = screen.getByText("A simple card");
    expect(card).toHaveClass("wfp--photo-card", "some-class");
  });

  it("uses href for linked cards while retaining url as a fallback", () => {
    const { rerender } = render(
      <Hero href="/from-href" isLink kind="landscape">
        Linked card
      </Hero>,
    );

    expect(screen.getByRole("link", { name: "Linked card" })).toHaveAttribute(
      "href",
      "/from-href",
    );

    rerender(
      <Hero href="/from-href" url="/from-url" isLink kind="landscape">
        Linked card
      </Hero>,
    );
    expect(screen.getByRole("link", { name: "Linked card" })).toHaveAttribute(
      "href",
      "/from-href",
    );

    rerender(
      <Hero url="/from-url" isLink kind="landscape">
        Linked card
      </Hero>,
    );
    expect(screen.getByRole("link", { name: "Linked card" })).toHaveAttribute(
      "href",
      "/from-url",
    );
  });

  it("renders the related-card structure", () => {
    const { container } = render(
      <Hero className="some-class" kind="related">
        Related card
      </Hero>,
    );

    const card = screen.getByText("Related card");
    expect(card.tagName).toBe("DIV");
    expect(
      container.querySelector(".wfp--photo-card__background"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".wfp--photo-card__info"),
    ).toBeInTheDocument();
  });

  it("derives related image alternative text from a string title", () => {
    render(
      <Hero image="/photo.jpg" kind="related" title="Food distribution" />,
    );

    expect(
      screen.getByRole("img", { name: "Food distribution" }),
    ).toHaveAttribute("src", "/photo.jpg");
  });

  it("accepts explicit image alternative text for non-text titles", () => {
    render(
      <Hero
        image="/photo.jpg"
        imageAlt="People receiving supplies"
        kind="related"
        title={<span>Food distribution</span>}
      />,
    );

    expect(
      screen.getByRole("img", { name: "People receiving supplies" }),
    ).toBeInTheDocument();
  });
});
