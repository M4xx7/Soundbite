import React from "react";
import {Icons, IconName} from "../assets/icons/icons";

interface Props {
  name: IconName;
  width?: number;
  height?: number;
  style?: any;
}

export default function Icon({ name, width = 24, height = 24, style }: Props) {
  const SvgIcon = Icons[name];

  if (!SvgIcon) {
    console.warn(`Missing icon: ${name}`);
    return null;
  }

  return <SvgIcon width={width} height={height} style={style} />;
}