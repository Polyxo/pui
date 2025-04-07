"use client";

import React from "react";
import styles from "./errorNotice.module.scss";
import { Empty } from "@progressiveui/react";
import MoreLink from "../MoreLink";
import EmptyResults from "components/Search/EmptyResults";

export default function ErrorNotice() {
  return (
    <Empty
      kind="large"
      className={styles.errorNotice}
      button={
        <MoreLink href="/" className={styles.link}>
          Return to Homepage
        </MoreLink>
      }
      // icon={<Parachute />}
      title="Page not found"
    >
      404 – The requested page was not found.
      <EmptyResults />
    </Empty>
  );
}
