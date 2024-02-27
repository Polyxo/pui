//import Link from 'next/link';
import React from "react";
import styles from "./styles.module.scss";
import { Link, LinksColumn, Footer } from "@wfp/react";
import NextLink from "next/link";

export default function FooterWrapper() {
  return (
    <Footer className={styles.footer} metaLinks="2023 © World Food Programme">
      <>
        <LinksColumn>
          <li className={`wfp--links-column-link`}>
            <NextLink href="https://designsystem.wfp.org" legacyBehavior>
              <Link>Documentation</Link>
            </NextLink>
          </li>
          <li className={`wfp--links-column-link`}>
            <Link href="https://feat-docs-ui-components.d2wxsj5e2v9riy.amplifyapp.com">
              Storybook
            </Link>
          </li>
        </LinksColumn>
        <LinksColumn>
          <li className={`wfp--links-column-link`}>
            <Link
              href="https://github.com/un-core/designsystem"
              target="_blank"
            >
              GitHub Repo
            </Link>
          </li>
          <li className={`wfp--links-column-link`}>
            <NextLink
              href="https://www.figma.com/file/KWrOuAzzykyysIDFpLikx1/WFP---Bridge"
              target="_blank"
              legacyBehavior
            >
              <Link>Figma library</Link>
            </NextLink>
          </li>
        </LinksColumn>
      </>
    </Footer>
  );
}
