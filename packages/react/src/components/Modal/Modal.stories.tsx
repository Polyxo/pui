import React, { useState } from "react";
import Modal from ".";
import Button from "../Button";

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

export const ModalContent: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(args.open);

    const handleModalClose = () => {
      setOpen(!isOpen);
    };

    return (
      <>
        <Modal
          {...args}
          onRequestClose={handleModalClose}
          open={isOpen}
          overscrollBehavior="inside"
          kindMobile="bottomsheet"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Et harum quidem
          rerum facilis est et expedita distinctio. Nam libero tempore, cum
          soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis
          dolor repellendus. Temporibus autem quibusdam et aut officiis debitis
          aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
          sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
          sapiente delectus, ut aut reiciendis voluptatibus maiores alias
          consequatur aut perferendis doloribus asperiores repellat. Con
          sapiente delectus, ut aut reiciendis voluptatibus maiores alias
          consequatur aut perferendis doloribus asperiores repellat. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum. Et harum quidem rerum facilis est
          et expedita distinctio. Nam libero tempore, cum soluta nobis est
          eligendi optio cumque nihil impedit quo minus id quod maxime placeat
          facere possimus, omnis voluptas assumenda est, omnis dolor
          repellendus. Temporibus autem quibusdam et aut officiis debitis aut
          rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
          et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
          delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
          perferendis doloribus asperiores repellat. Con sapiente delectus, ut
          aut reiciendis voluptatibus maiores alias consequatur aut perferendis
          doloribus asperiores repellat.
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

export const ModalFullscreen: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(args.open);

    const handleModalClose = () => {
      setOpen(!isOpen);
    };

    return (
      <>
        <Modal
          {...args}
          onRequestClose={handleModalClose}
          open={isOpen}
          overscrollBehavior="inside"
          kindMobile="fullscreen"
          kind="fullscreen"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Et harum quidem
          rerum facilis est et expedita distinctio. Nam libero tempore, cum
          soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis
          dolor repellendus. Temporibus autem quibusdam et aut officiis debitis
          aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae
          sint et molestiae non recusandae. Itaque earum rerum hic tenetur a
          sapiente delectus, ut aut reiciendis voluptatibus maiores alias
          consequatur aut perferendis doloribus asperiores repellat. Con
          sapiente delectus, ut aut reiciendis voluptatibus maiores alias
          consequatur aut perferendis doloribus asperiores repellat. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum. Et harum quidem rerum facilis est
          et expedita distinctio. Nam libero tempore, cum soluta nobis est
          eligendi optio cumque nihil impedit quo minus id quod maxime placeat
          facere possimus, omnis voluptas assumenda est, omnis dolor
          repellendus. Temporibus autem quibusdam et aut officiis debitis aut
          rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
          et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente
          delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut
          perferendis doloribus asperiores repellat. Con sapiente delectus, ut
          aut reiciendis voluptatibus maiores alias consequatur aut perferendis
          doloribus asperiores repellat.
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
