import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  onClose?: () => void;
  action?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      children,
      onClose,
      action,
      className = "",
      ...props
    },
    ref
  ) => {
    const variantConfig = {
      info: {
        container: "bg-blue-950/50 border-blue-800/60 text-blue-200",
        icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      },
      success: {
        container: "bg-emerald-950/50 border-emerald-800/60 text-emerald-200",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      },
      warning: {
        container: "bg-amber-950/50 border-amber-800/60 text-amber-200",
        icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      },
      danger: {
        container: "bg-red-950/50 border-red-800/60 text-red-200",
        icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
      },
    };

    const config = variantConfig[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={`relative flex items-start gap-3 rounded-2xl border p-4 text-sm backdrop-blur-md ${config.container} ${className}`}
        {...props}
      >
        {config.icon}
        <div className="flex-1 space-y-1">
          {title && <h4 className="font-bold leading-none">{title}</h4>}
          <div className="text-xs sm:text-sm opacity-90 leading-relaxed">
            {children}
          </div>
          {action && <div className="pt-2">{action}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";
