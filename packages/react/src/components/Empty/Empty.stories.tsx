import React from "react";
import markdown from "./README.mdx?raw";
import Empty from "./Empty";

export default {
  title: "Components/UI Elements/Empty",
  component: Empty,
  parameters: {
    componentSubtitle: "Component",
    status: "experimental",
    mdx: markdown,
  },
};

export const EmptyDefault = (args) => (
  <Empty
    icon={
      <svg aria-label="Empty state" role="img" viewBox="0 0 64 64" width="4rem">
        <circle cx="32" cy="32" fill="#e5f6ff" r="30" />
        <path
          d="M18 23h28v22H18z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path d="M25 31h14M25 37h9" stroke="currentColor" strokeWidth="3" />
      </svg>
    }
    {...args}
  />
);

EmptyDefault.args = {
  title: "No entries found",
  children: `You haven't yet created an entry`,
  kind: "large",
};

//   button: <Button kind="accent">New entry</Button>,
// icon: <IllustrationsMovingVanWithBackground alt="Moving van" width="25rem" />,

const emptysourcecode = `
import { Empty } from "@progressiveui/react";


<Empty
  icon={<img alt="Empty state" src="/path/to/illustration.svg" />}
  kind="large"
  title="No entries found"
>
  You haven't yet created an entry
</Empty>
`;
EmptyDefault.story = {
  parameters: {
    docs: {
      source: {
        code: emptysourcecode,
      },
    },
  },
};
