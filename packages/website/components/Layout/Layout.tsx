"use client";

import { WFPCoreProvider } from "@progressiveui/react";
import React from "react";
import Footer from "../Footer";
import Navigation from "../Navigation";
import SearchModal from "components/Search";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <WFPCoreProvider initialTheme="light">
      <SearchModal />
      <Navigation />
      {children}
      <Footer />
    </WFPCoreProvider>
  );
}
