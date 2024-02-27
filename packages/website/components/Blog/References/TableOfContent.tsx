import { Link, List, ListItem } from "@wfp/react";
import React from "react";
import { createSlug } from "../Mdx/Headings";
import styles from "./tableOfContent.module.scss";

interface HeadingProps {
  value: string;
}

const Heading2: React.FC<HeadingProps> = ({ value }) => {
  const idText = createSlug(value);
  return (
    <ListItem className={styles.heading2}>
      <Link href={`#${idText}`}>{value}</Link>
    </ListItem>
  );
};

interface TableOfContentProps {
  headings: string[];
}

const TableOfContent: React.FC<TableOfContentProps> = ({ headings = [] }) => {
  if (headings.length === 0) return null;
  return (
    <div className={styles.tableOfContent}>
      <h3>On this page</h3>
      <List className={styles.tableOfContentList} kind="simple">
        {headings.map((heading, index) => (
          <Heading2 key={index} value={heading} />
        ))}
      </List>
    </div>
  );
};

export default TableOfContent;
