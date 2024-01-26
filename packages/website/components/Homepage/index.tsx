import React from "react";
import Hero from "./Hero";
import Possiblities from "./Possibilities";
import Tools from "./Tools";
import Essentials from "./Essentials";
import { Wrapper } from "@wfp/react";

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
