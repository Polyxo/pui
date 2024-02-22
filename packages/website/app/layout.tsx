import "../scss/style.scss";
import { Open_Sans } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Layout from "../components/Layout/Layout";

config.autoAddCss = false;

const openSans = Open_Sans({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const data: any = await getGlobalData();

  return (
    <html lang="en">
      <head />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicons/wfp-favicon-png32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/favicons/wfp-favicon-png512.png"
      />
      <body className={openSans.variable}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
