import React from "react";
import HeadingBase from "./HeadingBase";

const H2: React.FC<Omit<Parameters<typeof HeadingBase>[0], "level">> = (
  props,
) => <HeadingBase {...props} level="h2" />;
export default H2;
