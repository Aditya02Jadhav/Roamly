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

type ButtonProps = ComponentProps<"button"> & {
  size?: "small" | "large";
};

export function Button({
  className = "",
  size = "large",
  type = "button",
  ...props
}: ButtonProps) {
  const sizeClasses =
    size === "small"
      ? "h-10 rounded-[10px] px-space-lg"
      : "rounded-[12px] px-8 py-3.5 shadow-sm";

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 bg-primary-container font-label-lg text-label-lg font-semibold text-on-primary transition-colors hover:bg-primary-pressed disabled:opacity-60 disabled:cursor-not-allowed ${sizeClasses} ${className}`}
      {...props}
    />
  );
}

