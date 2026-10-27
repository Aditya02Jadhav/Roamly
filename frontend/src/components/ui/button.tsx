import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  size?: "small" | "large";
};

export function ButtonLink({
  className = "",
  size = "large",
  ...props
}: ButtonLinkProps) {
  const sizeClasses =
    size === "small"
      ? "h-10 rounded-[10px] px-space-lg"
      : "rounded-[12px] px-8 py-3.5 shadow-sm";

  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 bg-primary-container font-label-lg text-label-lg font-semibold text-on-primary transition-colors hover:bg-primary-pressed ${sizeClasses} ${className}`}
      {...props}
    />
  );
}
