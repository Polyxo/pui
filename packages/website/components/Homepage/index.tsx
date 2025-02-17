import React from "react";
import Hero from "./Hero";
import Possiblities from "./Possibilities";
import Essentials from "./Essentials";
import { Wrapper } from "@progressiveui/react";

export default function Homepage() {
  return (
    <div>
      <Hero />
      <Wrapper pageWidth="md">
        <Possiblities />
        <Essentials />
      </Wrapper>
    </div>
  );
}
