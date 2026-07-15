import * as React from "react";
import { Button, Text } from "@progressiveui/react";
import { Add } from "@progressiveui/icons-react";
import { convertFolder } from "@progressiveui/icons-core";

export const Consumer = () => (
  <Text as="section" kind="story-title">
    <Button onClick={() => undefined}>
      <Add aria-label="Add" />
      Add item
    </Button>
  </Text>
);

const element: React.ReactElement = <Consumer />;
void element;

const convertIcons: typeof convertFolder = convertFolder;
void convertIcons;
