import React from "react";
import styles from "./hero.module.scss";
import { Wrapper } from "@wfp/react";
import Image from "next/image";
import screenImage from "../../public/homescreens.png";

export default function Hero() {
  return (
    <div className={styles.features}>
      <Wrapper pageWidth="md">
        <div className={styles.heroWrapper}>
          <div className={styles.hero}>Digital Design System</div>
        </div>

        <h1>
          BRIDGE is the
          <br /> UN WFP Design System
        </h1>
        <h2>The backbone Product serving all other Organization Products.</h2>
      </Wrapper>

      <div className={styles.screenImageWrapper}>
        <Wrapper pageWidth="md">
          <Image
            src={screenImage}
            alt="Bridge screen"
            className={styles.screenImage}
          />
        </Wrapper>
      </div>

      <Wrapper pageWidth="md">
        <p className={styles.description}>
          A collaborative project with the goal of leveraging Consistency,
          Scalability and Continuous Improvement for all Organization Products.
        </p>
      </Wrapper>

      {/* <div className={styles.buttons}>
          <Link href="./documentation/overview" legacyBehavior>
            <Button href="./documentation/overview">Get started</Button>
          </Link>
          <Link href="./components/overview" legacyBehavior>
            <Button
              href="./components/overview"
              kind="tertiary"
              icon={<FontAwesomeIcon icon={faArrowRight} />}
            >
              Components
            </Button>
          </Link>
        </div> */}
    </div>
  );
}
