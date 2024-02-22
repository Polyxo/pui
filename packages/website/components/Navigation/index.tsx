"use client";
import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  MainNavigationItem,
  InfoBar,
  MainNavigation,
  useTheme,
} from "@wfp/react";
import Search from "../Search";

import styles from "./styles.module.scss";
export default function Navigation() {
  const theme: any = useTheme();

  useEffect(() => {
    const wrapperElement = document.body;
    const prefixClass = `wfp--theme--`;

    const classes = wrapperElement.className
      .split(" ")
      .filter((c) => !c.startsWith(prefixClass));

    wrapperElement.className = classes.join(" ").trim();
    wrapperElement.classList.add(`wfp--theme--${theme.actualTheme}`);
  });

  return (
    <>
      <InfoBar className={styles.bannerNavigation}>
        🚧 This website is work in progress 👷
      </InfoBar>
      <MainNavigation
        logo={<NextLink href="./">Bridge</NextLink>}
        line={false}
        className={styles.mainNavigation}
        pageWidth="full"
      >
        <MainNavigationItem>
          <NextLink href="/">Homepage</NextLink>
        </MainNavigationItem>
        <MainNavigationItem>
          <NextLink href="/documentation/overview">Resources</NextLink>
          {/* <SidebarNavigation path="documentation" /> */}
        </MainNavigationItem>
        <MainNavigationItem>
          <NextLink href="/components/overview">Components</NextLink>
        </MainNavigationItem>
        <MainNavigationItem>
          <NextLink href="/support/overview">Support</NextLink>
        </MainNavigationItem>

        <MainNavigationItem className={styles.darkModeSwitch}>
          <div className={styles.meta}>
            <Search />
            {/* <Button
              kind="tertiary"
              onClick={(e) => {
                e.currentTarget.blur();
                theme.setTheme(theme.actualTheme === "dark" ? "light" : "dark");
              }}
            >
              {theme.actualTheme === "dark" ? (
                <FontAwesomeIcon icon={faSun} />
              ) : (
                <FontAwesomeIcon icon={faMoon} />
              )}
              </Button> */}

            {/* <NextLink
              href="https://github.com/un-core/designsystem"
              target="_blank"
              legacyBehavior
            >
              <Button
                icon={<FontAwesomeIcon icon={faGithub} />}
                href="https://github.com/un-core/designsystem"
              >
                GitHub
              </Button>
            </NextLink> */}
          </div>
        </MainNavigationItem>
      </MainNavigation>
    </>
  );
}
