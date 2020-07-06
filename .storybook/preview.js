import { addParameters } from '@storybook/react';
import theme from './theme';

import {
  //DocsPage,
  Title,
  //Subtitle,
  Description,
  Primary,
  Props,
  Stories,
  types,
  DocsContainer,
} from '@storybook/addon-docs/blocks';
import { DocsPage } from './blocks/DocsPage';
import { Subtitle } from './blocks/Subtitle';

import React, { FC } from 'react';
//import { Title } from '@storybook/addon-docs/Title';
/*import { Subtitle } from './Subtitle';
import { Description } from './Description';*/
//import { Primary } from './blocks-old/Primary';
//import { Props } from './blocks/Props';
/*
import { Props } from './Props';
import { Stories } from './Stories';
import { PRIMARY_STORY } from './types';*/
//import '../src/globals/scss/styles.scss';
import './storybook.scss';

export const DocsPaged = (props) => {
  console.log('props', props);
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Props />
      <Stories />
    </>
  );
};

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

// or global addParameters
export const parameters = {
  docs: {
    theme: theme,
  },
};
