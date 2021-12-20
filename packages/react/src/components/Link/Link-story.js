/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import React from 'react';
// import { action } from '@storybook/addon-actions';
//import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import { Download16 } from '@un/icons-react';
import Link from '../Link';
// import mdx from './Link.mdx';

// const sizes = {
//   'Small  (sm)': 'sm',
//   'Medium (md) - default': undefined,
//   'Large  (lg)': 'lg',
// };

export default {
  title: 'Components/Link',
  parameters: {
    component: Link,
    docs: {
      //  page: mdx,
    },
  },
};

export const _Default = (args) => (
  <Link href="http://www.carbondesignsystem.com" {...args}>
    Link
  </Link>
);

_Default.story = {
  name: 'Link',
};

// export const PairedWithIcon = () => (
//   <Link href="http://www.carbondesignsystem.com" renderIcon={Download16}>
//     Download
//   </Link>
// );
