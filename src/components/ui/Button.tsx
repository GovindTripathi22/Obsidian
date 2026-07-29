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
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl overflow-hidden group";

    const variantStyles = {
      primary:
        "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/15 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:ring-slate-900",
      secondary:
        "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 shadow-sm hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-slate-400",
      outline:
        "border border-slate-300/80 bg-white/80 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400",
      pink:
        "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white shadow-md shadow-pink-500/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus:ring-pink-500",
      cyan:
        "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-indigo-500",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 hover:-translate-y-0.5 active:scale-[0.98] focus:ring-rose-500",
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
