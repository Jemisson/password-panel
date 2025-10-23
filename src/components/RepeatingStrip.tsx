"use client";

import { CSSProperties } from "react";

type Props = {
  height?: number;
  imagePath?: string;
  className?: string;
};

export default function RepeatingStrip({
  height = 72,
  imagePath = "/tirinha.png",
  className = "",
}: Props) {
  const style: CSSProperties = {
    backgroundImage: `url(${imagePath})`,
    backgroundRepeat: "repeat-x",
    backgroundSize: "auto 100%",
    height,
    width: "100%",
  };

  return <div className={className} style={style} aria-hidden="true" />;
}
