import { List, ListItem } from "@wfp/react";
import React from "react";
import NavLink from "next/link";
import styles from "./empty-results.module.scss";

export default function EmptyResults() {
  return (
    <div className={styles.emptyResults}>
      <div>
        <List kind="simple">
          <ListItem>
            <NavLink href="/installation">Installation</NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">Components</NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">Icons</NavLink>
          </ListItem>
        </List>
      </div>
      <div>
        <List kind="simple">
          <ListItem>
            <NavLink href="/installation">Recommended libraries</NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">Support</NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">Contact</NavLink>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
