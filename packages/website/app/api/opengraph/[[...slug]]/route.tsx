import getPostContent from "components/Post/getPostContent";
import fs from "fs";

import { ImageResponse } from "next/og";
import path from "path";

// Image generation

// Route segment config
// export const runtime = "edge";

// Image metadata
const alt = "WFP Bridge";
const size = {
  width: 1200,
  height: 630,
};

const contentType = "image/png";

const fsPromises = fs.promises;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  console.log("GET", params);

  const data: any = await getPostContent(params);

  console.log("data", data.props.post.title);

  // Font
  /*
  const openSansSemiBold = fetch(
    new URL("/assets/fonts/OpenSans-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());*/

  // Define the path to the font file
  const fontPath = path.join("assets", "fonts", "OpenSans-SemiBold.ttf");

  // Read the font file as a Buffer
  const openSansSemiBold = await fsPromises.readFile(fontPath);

  // You can now use this data as needed in your application
  console.log("Font file loaded successfully!");

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "#007dbc",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: "12rem", fontWeight: "bold" }}>
          {" "}
          {data.props.post.title}
        </h1>
        <p style={{ fontSize: "2rem" }}>WFP Bridge</p>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Open Sans",
          data: await openSansSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
