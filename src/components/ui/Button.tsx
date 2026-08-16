import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "pink" | "cyan" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl overflow-hidden group";

    const variantStyles = {
      primary:
        "bg-white hover:bg-zinc-200 text-zinc-950 shadow-md shadow-white/5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:ring-white/50",
      secondary:
        "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600",
      outline:
        "border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-600 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-600",
      ghost:
        "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 focus:ring-zinc-600",
      pink:
        "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600 shadow-md shadow-zinc-950/50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-white/30",
      cyan:
        "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-zinc-500",
      danger:
        "bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-red-500",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-4.5 py-2.5 text-sm gap-2",
      lg: "px-6 py-3.5 text-base gap-2.5",
      icon: "p-2.5 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          leftIcon
        )}
        <span className="relative z-10">{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
