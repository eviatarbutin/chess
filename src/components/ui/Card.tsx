import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl border border-border bg-card p-6 ${
          hoverable
            ? "transition-all duration-300 hover:bg-card-hover hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            : ""
        } ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
