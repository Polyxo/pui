import React from "react";
import markdown from "./README.mdx";
import ReadMore from ".";

export default {
  title: "Components/UI Elements/ReadMore",
  component: ReadMore,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
    mdx: markdown,
  },
};

export const ReadMoreDefault: Story = {
  render: (args) => (
    <ReadMore {...args}>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
      diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
      rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum.
    </ReadMore>
  ),
  args: {
    colon: true,
    fade: true,
    maxHeight: 50,
  },
};
