import React from "react";
import styles from "./hero.module.scss";
import { Wrapper } from "@progressiveui/react";

export default function Hero() {
  return (
    <div className={styles.features}>
      <Wrapper pageWidth="md">
        <div className={styles.heroWrapper}>
          <div className={styles.hero}>Digital Design System</div>
        </div>

        <h1>Progressive UI</h1>
      </Wrapper>

      <Wrapper pageWidth="md">
        <p className={styles.description}>
          A collaborative project with the goal of leveraging Consistency,
          Scalability and Continuous Improvement for all Organization Products.
        </p>
      </Wrapper>
    </div>
  );
}
