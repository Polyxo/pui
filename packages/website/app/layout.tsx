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
    <html>
      <head />
      <body className={openSans.variable}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
