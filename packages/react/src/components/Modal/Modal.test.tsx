import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import Modal from "./Modal";

const getModal = () => screen.getByRole("dialog").closest(".wfp--modal");

describe("Modal", () => {
  it("requests close with the key trigger when Escape is pressed", () => {
    const onRequestClose = jest.fn();
    render(
      <Modal
        inPortal={false}
        open
        modalHeading="Keyboard modal"
        onRequestClose={onRequestClose}
      />,
    );

    fireEvent.keyDown(getModal() as HTMLElement, { key: "Enter" });
    expect(onRequestClose).not.toHaveBeenCalled();

    fireEvent.keyDown(getModal() as HTMLElement, { key: "Escape" });
    expect(onRequestClose).toHaveBeenCalledWith(expect.any(Object), "key");
  });

  it("submits on Enter only when the modal is open and opted in", () => {
    const onRequestSubmit = jest.fn();
    const { rerender } = render(
      <Modal
        inPortal={false}
        modalHeading="Keyboard modal"
        onRequestSubmit={onRequestSubmit}
        shouldSubmitOnEnter
      />,
    );

    fireEvent.keyDown(getModal() as HTMLElement, { key: "Enter" });
    expect(onRequestSubmit).not.toHaveBeenCalled();

    rerender(
      <Modal
        inPortal={false}
        open
        modalHeading="Keyboard modal"
        onRequestSubmit={onRequestSubmit}
      />,
    );
    fireEvent.keyDown(getModal() as HTMLElement, { key: "Enter" });
    expect(onRequestSubmit).not.toHaveBeenCalled();

    rerender(
      <Modal
        inPortal={false}
        open
        modalHeading="Keyboard modal"
        onRequestSubmit={onRequestSubmit}
        shouldSubmitOnEnter
      />,
    );
    fireEvent.keyDown(getModal() as HTMLElement, { key: "Enter" });
    expect(onRequestSubmit).toHaveBeenCalledTimes(1);
  });

  it("lets modal buttons handle Enter without a bubbled submit", async () => {
    const user = userEvent.setup();
    const onRequestClose = jest.fn();
    const onRequestSubmit = jest.fn();
    render(
      <Modal
        inPortal={false}
        open
        modalHeading="Keyboard modal"
        onRequestClose={onRequestClose}
        onRequestSubmit={onRequestSubmit}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        shouldSubmitOnEnter
      />,
    );

    screen.getByRole("button", { name: "Save" }).focus();
    await user.keyboard("{Enter}");
    expect(onRequestSubmit).toHaveBeenCalledTimes(1);
    expect(onRequestClose).not.toHaveBeenCalled();

    screen.getByRole("button", { name: "Cancel" }).focus();
    await user.keyboard("{Enter}");
    expect(onRequestSubmit).toHaveBeenCalledTimes(1);
    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });

  it("does not forward component configuration props to the DOM", () => {
    render(
      <Modal
        inPortal={false}
        open
        modalHeading="Configuration modal"
        modalText="Supporting text"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        primaryButtonDisabled
        secondaryButtonDisabled
        shouldSubmitOnEnter
        width="wide"
        warning
      />,
    );

    const modal = getModal();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(modal).not.toHaveAttribute("modalText");
    expect(modal).not.toHaveAttribute("primaryButtonText");
    expect(modal).not.toHaveAttribute("secondaryButtonText");
    expect(modal).not.toHaveAttribute("shouldSubmitOnEnter");
    expect(modal).not.toHaveAttribute("width");
    expect(modal).not.toHaveAttribute("warning");
  });
});
