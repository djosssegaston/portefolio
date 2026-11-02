"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

type Props = {
  className?: string;
};

export default function LazyHeroScene(props: Props) {
  return <HeroScene {...props} />;
}
