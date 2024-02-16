"use client";
import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  MainNavigationItem,
  BannerNavigation,
  MainNavigation,
  useTheme,
  SubNavigation,
  SubNavigationItem,
} from "@wfp/react";
import Search from "../Search";

import styles from "./styles.module.scss";

export default function Navigation() {
  //const { t } = useTranslation('website');
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
      <BannerNavigation className={styles.bannerNavigation}>
        <span>🚧 This website is work in progress 👷</span>
      </BannerNavigation>

      <MainNavigation
        logo={<NextLink href="/">Bridge</NextLink>}
        line={false}
        className={styles.mainNavigation}
        pageWidth="full"
      >
        <MainNavigationItem>
          <NextLink href="/brand/overview">Brand</NextLink>
        </MainNavigationItem>
        <MainNavigationItem
          subNavigation={
            <SubNavigation>
              <SubNavigationItem>
                <NextLink href="/foundations/overview">Foundations</NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/icons/overview">Icons</NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/components/overview">
                  Design Components
                </NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/templates/overview">Templates</NextLink>
              </SubNavigationItem>
            </SubNavigation>
          }
        >
          <NextLink href="">Digital Assets</NextLink>
        </MainNavigationItem>
        <MainNavigationItem
          subNavigation={
            <SubNavigation>
              <SubNavigationItem>
                <NextLink href="tokens/overview">Design Tokens</NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/how-tos/overview">How-tos</NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/best-practices/overview">
                  Best Practices
                </NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/libraries/overview">Libraries</NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/accessibility/overview">
                  Accessibility
                </NextLink>
              </SubNavigationItem>
              <SubNavigationItem>
                <NextLink href="/productlist/overview">Products List</NextLink>
              </SubNavigationItem>
            </SubNavigation>
          }
        >
          <NextLink href="">Resources</NextLink>
          {/* <SidebarNavigation path="documentation" /> */}
        </MainNavigationItem>
        <MainNavigationItem>
          <NextLink href="/support/contact">Support</NextLink>
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
