import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return <div>{children}</div>;
}
