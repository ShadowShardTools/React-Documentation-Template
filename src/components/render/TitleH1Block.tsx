import React from "react";
import HeadingBase from "./HeadingBase";

const H1: React.FC<Omit<Parameters<typeof HeadingBase>[0], "level">> = (
  props,
) => <HeadingBase {...props} level="h1" />;
export default H1;
