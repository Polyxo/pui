import React, { useState } from "react";
import Modal from ".";

export default {
  title: "Components/Content Related/Modal",
  component: Modal,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
  },
};

export const ModalDefault: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(args.open);

    const handleModalClose = () => {
      setOpen(!isOpen);
    };

    return (
      <>
        <Modal {...args} onRequestClose={handleModalClose} open={isOpen}>
          {args.children}
        </Modal>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
      </>
    );
  },
  args: {
    children: "Text",
    modalLabel: "Modal label",
    modalHeading: "Modal heading",
    modalText: "Modal text",
  },
};
