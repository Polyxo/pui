import { Link, List, ListItem } from "@wfp/react";
import React from "react";

const files: any = [
  "192x192.png",
  "apple-touch-icon-57-precomposed.png",
  "apple-touch-icon-72-precomposed.png",
  "apple-touch-icon-76-precomposed.png",
  "apple-touch-icon-114-precomposed.png",
  "apple-touch-icon-120-precomposed.png",
  "apple-touch-icon-144-precomposed.png",
  "apple-touch-icon-152-precomposed.png",
  "apple-touch-icon-180-precomposed.png",
  "apple-touch-icon-precomposed.png",
  "favicon-32x32.png",
  "favicon-48x48.png",
  "favicon-64x64.png",
  "favicon-96x96.png",
  "favicon-260x260.png",
];

export default function FaviconDownloadLinks() {
  return (
    <List kind="bullets">
      {files.map((file, i) => (
        <ListItem key={i} download>
          <Link
            href={`${process.env.NEXT_PUBLIC_DOMAIN}logos/favicons/${file}`}
            target="_blank"
          >
            {file}
          </Link>
        </ListItem>
      ))}
    </List>
  );
}
