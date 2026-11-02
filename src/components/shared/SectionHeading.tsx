import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  label: string;
  title?: ReactNode;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Every public section uses this heading. Keeping the kicker, ghost index,
 * title reveal and lead paragraph in one component is what makes the pages
 * feel like a single product instead of a collection of blocks.
 */
export default function SectionHeading({
  index,
  label,
  title,
  highlight,
  description,
  align = "center",
  className,
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "section-heading-wrap relative mb-14 sm:mb-16",
        centered && "text-center",
        className,
      )}
    >
      {index && (
        <span
          aria-hidden="true"
          data-ghost
          className={cn(
            "section-ghost",
            centered ? "left-1/2 -translate-x-1/2" : "left-0",
          )}
        >
          {index}
        </span>
      )}

      <div
        className={cn(
          "section-kicker relative",
          centered && "justify-center",
        )}
        data-reveal="fade"
      >
        {index && <span className="section-kicker-index">{index}</span>}
        <span className="section-kicker-line" data-kicker-line />
        <span>{label}</span>
      </div>

      <h2 className="section-heading relative mt-5" data-heading>
        {title}
        {highlight && (
          <>
            {title ? " " : null}
            <span className="gradient-text">{highlight}</span>
          </>
        )}
      </h2>

      {description && (
        <p className="section-desc relative" data-reveal="up" data-reveal-delay="0.12">
          {description}
        </p>
      )}
    </div>
  );
}
