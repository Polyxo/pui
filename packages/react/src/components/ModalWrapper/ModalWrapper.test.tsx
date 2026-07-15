import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import ModalWrapper from "./ModalWrapper";

type ModalWrapperProps = React.ComponentProps<typeof ModalWrapper>;

const defaultProps: ModalWrapperProps = {
  id: "modal",
  buttonTriggerText: "Open Modal",
  buttonTriggerClassName: "btn-trigger",
  modalHeading: "Transactional Modal",
  modalLabel: "Test Modal Label",
  primaryButtonText: "Save",
  secondaryButtonText: "Cancel",
  shouldCloseAfterSubmit: true,
};

const getModal = () => screen.getByRole("dialog").closest(".wfp--modal");

const renderModal = (overrides: Partial<ModalWrapperProps> = {}) => {
  const handleSubmit = jest.fn();

  render(
    <ModalWrapper {...defaultProps} handleSubmit={handleSubmit} {...overrides}>
      <p className="wfp--modal-content__text">Modal content</p>
    </ModalWrapper>,
  );

  return { handleSubmit };
};

describe("ModalWrapper", () => {
  it("renders its trigger and a closed modal", () => {
    renderModal();

    expect(screen.getByRole("button", { name: "Open Modal" })).toHaveClass(
      "btn-trigger",
    );
    expect(getModal()).not.toHaveClass("is-visible");
  });

  it("opens the modal when the trigger is clicked", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Open Modal" }));

    expect(getModal()).toHaveClass("is-visible");
  });

  it("closes the modal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Open Modal" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(getModal()).not.toHaveClass("is-visible");
  });

  it("submits and closes the modal when Save is clicked", async () => {
    const user = userEvent.setup();
    const { handleSubmit } = renderModal();

    await user.click(screen.getByRole("button", { name: "Open Modal" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(expect.any(Function));
    expect(getModal()).not.toHaveClass("is-visible");
  });

  it("keeps the modal open after Save when automatic closing is disabled", async () => {
    const user = userEvent.setup();
    const { handleSubmit } = renderModal({ shouldCloseAfterSubmit: false });

    await user.click(screen.getByRole("button", { name: "Open Modal" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(getModal()).toHaveClass("is-visible");
  });
});
