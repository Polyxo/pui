"use client";

import React from "react";
import styles from "./errorNotice.module.scss";
import { Empty } from "@wfp/react";
import MoreLink from "../MoreLink";
import { Parachute } from "@wfp/pictograms-react";

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
      pageWidth="lg"
      icon={<Parachute />}
      title="Page not found"
    >
      404 – The requested page was not found.
    </Empty>
  );
}
