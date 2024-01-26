import React from "react";
import styles from "./possibilities.module.scss";
import MoreLink from "../MoreLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Wrapper } from "@wfp/react";
import {
  faPenNib,
  faCode,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@wfp/react";

import { faReact } from "@fortawesome/free-brands-svg-icons";

function PossibilitiesContainer({ className = "", title, icon, content }: any) {
  return (
    <div
      className={`${styles.container} ${className}`} /*style={{ background }}*/
    >
      <div className={styles.icon}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className={styles.content}>
        <h4>{title}</h4>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default function Possiblities() {
  return (
    <Wrapper pageWidth="lg" className={styles.possibilities}>
      <hr className={styles.customHr} />
      <div className={styles.possibilitiesWrapper}>
        <PossibilitiesContainer
          title="Are you a Designer?"
          content={
            <>
              <Link href="./documentation/overview" legacyBehavior>
                <Button btnSolid icon={<FontAwesomeIcon icon={faArrowRight} />}>
                  Start designing
                </Button>
              </Link>
            </>
          }
          icon={faPenNib}
        />

        <PossibilitiesContainer
          title="Are you a Developer?"
          content={
            <>
              <Link href="./documentation/overview" legacyBehavior>
                <Button btnSolid icon={<FontAwesomeIcon icon={faArrowRight} />}>
                  Start coding
                </Button>
              </Link>
            </>
          }
          icon={faCode}
        />
      </div>

      <hr className={styles.customHr} />
    </Wrapper>
  );
}
