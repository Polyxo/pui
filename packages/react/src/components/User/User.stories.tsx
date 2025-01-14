import React from "react";
import User from ".";
import { List, ListItem } from "../List";

export default {
  title: "Components/UI Elements/User",
  component: User,
  parameters: {
    componentSubtitle: "Component",
    status: "released",
  },
};

export const UserDefault = (args) => <User {...args} />;

UserDefault.args = {
  name: "Max Mustermann",
  showName: true,
  image:
    "https://www.wfp.org/sites/default/files/styles/page_accordion/public/images/ourwork_humanitarian.jpg?itok=R0ymBwxH",
};

export const AvatarOnly = (args) => (
  <User
    name="Max Mustermann"
    showName={false}
    image="https://www.wfp.org/sites/default/files/styles/page_accordion/public/images/ourwork_humanitarian.jpg?itok=R0ymBwxH"
  />
);

const description = `
You can show the avatar only without showing the username.
`;

AvatarOnly.story = {
  parameters: {
    docs: {
      storyDescription: description,
    },
  },
};

export const ExtendedUser = (args: any) => (
  <User
    alt="Image Alt text"
    description={
      <List kind="simple" small>
        <ListItem>Business Support Assistant G4</ListItem>
        <ListItem>Fixed Term</ListItem>
      </List>
    }
    extendedDescription={
      <List kind="simple" small>
        <ListItem title="First level supervisor">Marie Curie</ListItem>
        <ListItem title="Mrc">Tanzania Country Office</ListItem>
        <ListItem title="Head of unit">Max Planck</ListItem>
      </List>
    }
    name="Albert Einstein"
    image="https://www.wfp.org/sites/default/files/styles/page_accordion/public/images/ourwork_humanitarian.jpg?itok=R0ymBwxH"
  />
);

const extendedDescription = `
You can show the avatar only without showing the username.
`;

const extendedsourcecode = `
import { User, List, ListItem } from "@progressiveui/react";

<User
    alt="Image Alt text"
    description={
      <List kind="simple" small>
        <ListItem>Business Support Assistant G4</ListItem>
        <ListItem>Fixed Term</ListItem>
      </List>
    }
    extendedDescription={
      <List kind="simple" small>
        <ListItem title="First level supervisor">Marie Curie</ListItem>
        <ListItem title="Mrc">Tanzania Country Office</ListItem>
        <ListItem title="Head of unit">Max Planck</ListItem>
      </List>
    }
    name="Albert Einstein"
    image="https://www.wfp.org/sites/default/files/styles/page_accordion/public/images/ourwork_humanitarian.jpg?itok=R0ymBwxH"
  />
`;

ExtendedUser.story = {
  parameters: {
    docs: {
      storyDescription: extendedDescription,
      source: {
        code: extendedsourcecode,
      },
    },
  },
};
