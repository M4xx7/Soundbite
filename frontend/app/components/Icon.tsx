import React from "react";
import { Image } from "react-native";
import { Icons, IconName } from "../assets/icons/icons";

interface Props {
  name: IconName;
  width?: number;
  height?: number;
  style?: any;
}

export default function Icon({ name, width = 24, height = 24, style }: Props) {
  const IconAsset = Icons[name];

  if (!IconAsset) {
    console.warn(`Missing icon: ${name}`);
    return null;
  }


  if (typeof IconAsset === "number" || (typeof IconAsset === "object" && "uri" in IconAsset)) {
    return (
      <Image 
        source={IconAsset} 
        style={[{ width, height, resizeMode: "contain" }, style]} 
      />
    );
  }

  const SvgIcon = IconAsset;
  return <SvgIcon width={width} height={height} style={style} />;
}