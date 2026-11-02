"use client";

import dynamic from "next/dynamic";
import type { AmbientVariant } from "./AmbientScene";

const AmbientScene = dynamic(() => import("./AmbientScene"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  variant?: AmbientVariant;
  className?: string;
  density?: number;
  opacity?: number;
};

export default function LazyAmbientScene(props: Props) {
  return <AmbientScene {...props} />;
}
