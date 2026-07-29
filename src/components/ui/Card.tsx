import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverable = false, glass = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-slate-200/80 p-6 transition-all duration-300 ${
          glass ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white shadow-sm"
        } ${
          hoverable
            ? "hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 cursor-pointer"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`mb-4 space-y-1.5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-lg font-bold text-slate-900 tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm text-slate-500 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-sm text-slate-700 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`mt-6 flex items-center justify-between border-t border-slate-100 pt-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);
