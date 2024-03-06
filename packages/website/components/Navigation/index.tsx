"use client";
import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  MainNavigationItem,
  MainNavigation,
  useTheme,
  SubNavigation,
  SubNavigationItem,
  InfoBar,
  SubNavigationContent,
  useMainNavigation,
} from "@wfp/react";
import Search from "../Search";

import styles from "./styles.module.scss";
import LinkWithNext from "components/LinkWithNext";
import { useParams } from "next/navigation";

function CloseNavigationTrigger() {
  const params = useParams();
  const { onChangeSub, setOpenMobileMenu } = useMainNavigation();

  useEffect(() => {
    onChangeSub("close");
    setOpenMobileMenu(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return null;
}

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
      <InfoBar className={styles.bannerNavigation}>
        <span>🚧 This website is work in progress 👷</span>
      </InfoBar>

      <MainNavigation
        logo={<NextLink href="/">Bridge</NextLink>}
        line={false}
        className={styles.mainNavigation}
        pageWidth="full"
      >
        <CloseNavigationTrigger />
        <MainNavigationItem>
          <NextLink href="/brand/overview">Brand</NextLink>
        </MainNavigationItem>
        <MainNavigationItem
          kind="callout"
          subNavigation={
            <SubNavigation>
              <SubNavigationContent>
                <SubNavigationItem>
                  <LinkWithNext href="/foundations/overview">
                    Foundations
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/icons/overview">Icons</LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/components/overview">
                    Design Components
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/templates/overview">
                    Templates
                  </LinkWithNext>
                </SubNavigationItem>
              </SubNavigationContent>
            </SubNavigation>
          }
        >
          <span>Digital Assets</span>
        </MainNavigationItem>
        <MainNavigationItem
          kind="callout"
          subNavigation={
            <SubNavigation>
              {/* <SubNavigationHeader>
                <SubNavigationTitle>Welcome Max!</SubNavigationTitle>
          </SubNavigationHeader> */}
              <SubNavigationContent>
                <SubNavigationItem>
                  <LinkWithNext href="/tokens/overview">
                    Design Tokens
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/how-tos/overview">How-tos</LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/best-practices/overview">
                    Best Practices
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/libraries/overview">
                    Libraries
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/accessibility/overview">
                    Accessibility
                  </LinkWithNext>
                </SubNavigationItem>
                <SubNavigationItem>
                  <LinkWithNext href="/productlist/overview">
                    Products List
                  </LinkWithNext>
                </SubNavigationItem>
              </SubNavigationContent>
            </SubNavigation>
          }
        >
          <span>Resources</span>
          {/* <SidebarNavigation path="documentation" /> */}
        </MainNavigationItem>
        <MainNavigationItem>
          <NextLink href="/support/contact">Support</NextLink>
        </MainNavigationItem>

        <MainNavigationItem className={styles.darkModeSwitch}>
          <div className={styles.meta}>
            <Search />
          </div>
        </MainNavigationItem>
      </MainNavigation>
    </>
  );
}
