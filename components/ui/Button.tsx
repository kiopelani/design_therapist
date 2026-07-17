import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-stone-900 text-stone-50 shadow-lg shadow-stone-900/20 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/25 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none",
  secondary:
    "border border-stone-200/80 bg-white/80 text-stone-800 shadow-sm backdrop-blur hover:border-stone-300 hover:bg-white disabled:bg-stone-100 disabled:text-stone-400",
  ghost:
    "text-stone-600 hover:bg-stone-900/5 disabled:text-stone-300",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
