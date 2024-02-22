import React, { useLayoutEffect } from "react";
import { useFrame } from "react-frame-component";
import { LivePreview } from "react-live";

export default function InnerFrame() {
  const { document: doc } = useFrame();

  useLayoutEffect(() => {
    // this covers development case as well as part of production
    document.head.querySelectorAll("style").forEach((style) => {
      const frameStyles = style.cloneNode(true);
      doc?.head.append(frameStyles);
    });
    // inject the production minified styles into the iframe
    // if (process && process.env.NODE_ENV === "production") {
    document.head.querySelectorAll('link[as="style"]').forEach((ele) => {
      doc?.head.append(ele.cloneNode(true));
    });
    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((ele) => {
      doc?.head.append(ele.cloneNode(true));
    });
    //}
  }, [doc]);

  return (
    <div>
      <LivePreview
      // className={`${stylesModule.preview}`}
      // dir={rtl ? "rtl" : "ltr"}
      // style={{ minWidth: width ? width + "px" : undefined }}
      />
    </div>
  );
}
