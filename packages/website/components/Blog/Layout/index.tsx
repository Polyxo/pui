"use client";
import React from "react";
import Head from "next/head";
import styles from "./layout.module.scss";
import SidebarWrapper from "../../Sidebar";
import Homepage from "../../Homepage";

interface LayoutProps {
  posts: any;
  post: any;
  propTypes: any;
  head?: any;
}

const Layout = ({ posts, post, propTypes, head }: LayoutProps) => (
  <>
    <Head>{head}</Head>

    <div className={styles.layout}>
      {post?.slug === "homepage" ? (
        <Homepage />
      ) : (
        <SidebarWrapper posts={posts} post={post} propTypes={propTypes} />
      )}
    </div>
  </>
);

export default Layout;
