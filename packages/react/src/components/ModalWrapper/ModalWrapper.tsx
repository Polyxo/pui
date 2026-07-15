import * as React from "react";
import Modal from "../Modal";
import Button from "../Button";
import useSettings from "../../hooks/useSettings";
import { ButtonKind } from "../../utils";
import { ModalProps } from "../Modal/Modal";

/** Modal Wrapper component to encapsulate your Modal within a button. */
interface ModalWrapperProps
  extends ModalProps, React.ComponentPropsWithRef<"div"> {
  /**
   * ID of the trigger button.
   */
  id?: string;
  /*status?: string;
   */
  disabled?: boolean;
  /**
   * Specify a custom trigger `Button`.
   */
  customButton?: React.ReactElement;
  /**
   * Specify the text for the trigger `Button`.
   */
  buttonTriggerText?: React.ReactNode;
  /**
   * Specify a `class` for the trigger `Button`.
   */
  buttonTriggerClassName?: string;
  /**
   * @param handle - function to open the modal
   */
  handleOpen?: () => void;
  /**
   * @param handle - function to submit content in the modal
   */
  handleSubmit?: (handle: () => void) => void;
  /**
   * @param handle - function to close the modal
   */
  handleClose?: () => void;
  /**
   * Specify the kind of trigger `Button`.
   */
  triggerButtonKind?: ButtonKind;
  /**
   * Specify whether the Modal should be closed after submit
   */
  shouldCloseAfterSubmit?: boolean;
  /**
   * Specify whether the primary button should be disabled or not
   */
  primaryButtonDisabled?: boolean;
  /**
   * A function that is called when the user presses the `Esc` key to close the modal.
   */
  onKeyDown?: (evt: React.KeyboardEvent<HTMLDivElement>) => void;
}

const assignRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

type CustomButtonProps = {
  disabled?: boolean;
  inputref?: React.RefObject<HTMLButtonElement | null>;
  onClick?: React.MouseEventHandler;
  ref?: React.Ref<HTMLButtonElement>;
};

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  customButton,
  id,
  onKeyDown,
  buttonTriggerText,
  buttonTriggerClassName,
  triggerButtonKind,
  disabled,
  handleSubmit = () => {},
  handleOpen: onOpen,
  handleClose: onClose,
  shouldCloseAfterSubmit = true,
  ...other
}) => {
  const { prefix } = useSettings();
  const triggerButton = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const isOpenRef = React.useRef(isOpen);
  const wasOpen = React.useRef(isOpen);
  const customButtonRef = (
    customButton as
      | React.ReactElement<{ ref?: React.Ref<HTMLButtonElement> }>
      | undefined
  )?.props.ref;

  const setCustomButtonRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerButton.current = node;
      assignRef(customButtonRef, node);
    },
    [customButtonRef],
  );

  React.useEffect(() => {
    if (wasOpen.current && !isOpen) {
      triggerButton.current?.focus();
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  const handleOpen = React.useCallback(() => {
    if (isOpenRef.current) return;
    isOpenRef.current = true;
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = React.useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleOnRequestSubmit = () => {
    if (handleSubmit) {
      handleSubmit(handleClose);
      if (shouldCloseAfterSubmit) {
        handleClose();
      }
    }
  };

  const props = {
    ...other,
    open: isOpen,
    onRequestClose: handleClose,
    onRequestSubmit: handleOnRequestSubmit,
  };

  const customButtonEl = customButton
    ? React.cloneElement(
        customButton as React.ReactElement<CustomButtonProps>,
        {
          disabled,
          onClick: handleOpen,
          ref: setCustomButtonRef,
          ...(typeof customButton.type === "string"
            ? {}
            : { inputref: triggerButton }),
        },
      )
    : undefined;

  return (
    <div
      role="presentation"
      className={`${prefix}--modal__wrapper`}
      onKeyDown={(evt) => {
        if (evt.key === "Escape" && isOpen) {
          handleClose();
          onKeyDown?.(evt);
        }
      }}
    >
      {customButton ? (
        <React.Fragment>{customButtonEl}</React.Fragment>
      ) : (
        <Button
          id={id}
          className={buttonTriggerClassName}
          disabled={disabled}
          kind={triggerButtonKind}
          onClick={handleOpen}
          ref={triggerButton}
        >
          {buttonTriggerText}
        </Button>
      )}
      <Modal {...props}>{children}</Modal>
    </div>
  );
};

ModalWrapper.displayName = "ModalWrapper";

export default ModalWrapper;
