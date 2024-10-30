import { List, ListItem } from "@progressiveui/react";
import React from "react";
import NavLink from "next/link";
import styles from "./empty-results.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxesStacked,
  faCirclePlay,
  faIcons,
  faQuestionCircle,
  faStar,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

export default function EmptyResults({ className }: { className?: string }) {
  const classes = classNames(styles.emptyResults, className);
  return (
    <div className={classes}>
      <div>
        <List kind="simple">
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faCirclePlay} />
              Installation
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faBoxesStacked} />
              Components
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faIcons} />
              Icons
            </NavLink>
          </ListItem>
        </List>
      </div>
      <div>
        <List kind="simple">
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faStar} />
              Recommended libraries
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faQuestionCircle} />
              Support
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink href="/installation">
              <FontAwesomeIcon icon={faEnvelope} />
              Contact
            </NavLink>
          </ListItem>
        </List>
      </div>
    </div>
  );
}
