"use client";

import { WFPCoreProvider } from "@progressiveui/react";

export function WFPCoreProviderClient({ children }: any) {
  return <WFPCoreProvider>{children}</WFPCoreProvider>;
}
