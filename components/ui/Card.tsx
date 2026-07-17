import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-5",
  md: "p-7 sm:p-8",
  lg: "p-7 sm:p-10",
};

export function Card({
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`glass-card rounded-3xl ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
