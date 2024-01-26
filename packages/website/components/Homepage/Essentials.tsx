import React from "react";
import styles from "./essentials.module.scss";
import Link from "next/link";
import MoreLink from "../MoreLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper } from "@wfp/react";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

/* interface PossibilitiesContainerProps {
  title?: string;
  background?: string;
  content: string | JSX.Element;
  link?: string;
  npmLink?: boolean;
  figmaLink?: boolean;
} */

function PossibilitiesContainer({
  title,
  content,
  type,
  link = "",
  npmLink,
  figmaLink,
}: any) {
  return (
    <div className={styles.container}>
      <div className={type == "howto" ? styles.contentOther : styles.content}>
        {content}
      </div>
      <div className={type == "howto" ? styles.footerOther : styles.footer}>
        <p>{title}</p>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={faArrowRightLong} />
        </div>
      </div>
    </div>
  );
}

export default function Essentials() {
  return (
    <div>
      <div className={styles.essentialContainer}>
        <div className={styles.headerTitle}>
          <h3>Essentials</h3>
        </div>
        <p className={styles.description}>
          Some of the main tools we use to design digital experiences
        </p>
        <div className={styles.essentialWrapper}>
          <PossibilitiesContainer
            title="Spacing Units"
            link="https://npmjs.com/package/@wfp/themes-core"
          />
          <PossibilitiesContainer
            title="Awesome icons"
            link="https://npmjs.com/package/@wfp/react"
          />
          <PossibilitiesContainer title="Notifications" />
          <PossibilitiesContainer title="Data visualization" />
        </div>
      </div>

      <hr className={styles.customHr} />

      <div className={styles.essentialContainer}>
        <div className={styles.headerTitle}>
          <h3>How-tos</h3>
        </div>
        <p className={styles.description}>
          These guides will show you how to design for different platforms and
          experiences.
        </p>
        <div className={styles.essentialWrapper2}>
          <PossibilitiesContainer
            title="Install the UI-KIT"
            link="https://npmjs.com/package/@wfp/themes-core"
            type="howto"
          />
          <PossibilitiesContainer
            title="Design for Accessibility"
            link="https://npmjs.com/package/@wfp/react"
            type="howto"
          />
        </div>
      </div>
    </div>
  );
}
