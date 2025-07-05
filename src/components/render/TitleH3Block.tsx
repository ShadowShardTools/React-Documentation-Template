import React from "react";
import HeadingBase from "./HeadingBase";

const H3: React.FC<Omit<Parameters<typeof HeadingBase>[0], "level">> = (
  props,
) => <HeadingBase {...props} level="h3" />;
export default H3;
