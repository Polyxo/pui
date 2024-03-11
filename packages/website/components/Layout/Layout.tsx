"use client";

import { WFPCoreProvider } from "@wfp/react";
import React from "react";
import Footer from "../Footer";
import Navigation from "../Navigation";
// import SearchWrapper from "../Search";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <WFPCoreProvider initialTheme="light">
      <Navigation />
      {children}
      <Footer />
      {/* <SearchWrapper />  is there a reason for this search here? @Robert */}
    </WFPCoreProvider>
  );
}
