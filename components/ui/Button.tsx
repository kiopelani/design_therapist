import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-stone-800 text-white hover:bg-stone-700 disabled:bg-stone-300 disabled:text-stone-500",
  secondary:
    "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 disabled:bg-stone-100 disabled:text-stone-400",
  ghost: "text-stone-600 hover:bg-stone-100 disabled:text-stone-300",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
