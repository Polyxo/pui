import React from "react";
import styles from "./essentials.module.scss";
import Link from "next/link";
import MoreLink from "../MoreLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper } from "@wfp/react";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import gridDividerIcon from "../../public/grid-dividers-light.svg";
import spacingIcon from "../../public/distribute-spacing-horizontal-light.svg";
import flagIcon from "../../public/font-awesome-light.svg";
import bellsIcon from "../../public/bells-light.svg";
import lineChartIcon from "../../public/chart-column-light.svg";
import bubbleChartIcon from "../../public/chart-scatter-bubble-light.svg";
import installIcon from "../../public/sign-posts-wrench-light.svg";
import eyeIcon from "../../public/eye-light.svg";
import accessibilityIcon from "../../public/universal-access-light.svg";

/* interface PossibilitiesContainerProps {
  title?: string;
  background?: string;
  content: string | JSX.Element;
  link?: string;
  npmLink?: boolean;
  figmaLink?: boolean;
} */

function PossibilitiesContainer({ title, content, type, link = "" }: any) {
  return (
    <div className={styles.container}>
      <div className={type == "howto" ? styles.contentOther : styles.content}>
        {content}
      </div>
      <Link href={link}>
        <div className={type == "howto" ? styles.footerOther : styles.footer}>
          <p>{title}</p>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faArrowRightLong} />
          </div>
        </div>
      </Link>
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
            link="./documentation/tokens"
            content={
              <div className={styles.flexDisplay}>
                <Image
                  src={gridDividerIcon}
                  alt="spacing unit icon"
                  className={styles.fontAwesomeIconStyle}
                />
                <Image
                  src={spacingIcon}
                  alt="spacing unit icon"
                  className={styles.fontAwesomeIconStyle}
                />
              </div>
            }
          />
          <PossibilitiesContainer
            title="Awesome icons"
            link="./documentation/icons/core-icons"
            content={
              <Image
                src={flagIcon}
                alt="fontawesome icon"
                className={styles.fontAwesomeIconStyle}
              />
            }
          />
          <PossibilitiesContainer
            title="Notifications"
            content={
              <Image
                src={bellsIcon}
                alt="notifications icon"
                className={styles.fontAwesomeIconStyle}
                style={{ width: "40%" }}
              />
            }
          />
          <PossibilitiesContainer
            title="Data visualization"
            content={
              <div className={styles.flexDisplay}>
                <Image
                  src={lineChartIcon}
                  alt="data visualization icon"
                  className={styles.fontAwesomeIconStyle}
                />
                <Image
                  src={bubbleChartIcon}
                  alt="data visualization icon"
                  className={styles.fontAwesomeIconStyle}
                />
              </div>
            }
          />
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
            link="./developing/installation"
            type="howto"
            content={
              <Image
                src={installIcon}
                alt="install icon"
                className={styles.fontAwesomeIconStyle}
              />
            }
          />
          <PossibilitiesContainer
            title="Design for Accessibility"
            link="https://npmjs.com/package/@wfp/react"
            type="howto"
            content={
              <div className={styles.flexDisplay}>
                <Image
                  src={eyeIcon}
                  alt="accessibility icon"
                  className={styles.fontAwesomeIconStyle}
                  style={{ width: "35%" }}
                />
                <Image
                  src={accessibilityIcon}
                  alt="accessibility icon"
                  className={styles.fontAwesomeIconStyle}
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
