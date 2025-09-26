import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";

    const variants = {
      default:
        "bg-artisan-gold-500 text-white hover:bg-artisan-gold-600 shadow-lg hover:shadow-xl",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline:
        "border border-artisan-gold-500 text-artisan-gold-500 hover:bg-artisan-gold-50 dark:hover:bg-artisan-gold-950",
      secondary:
        "bg-artisan-brown-200 text-artisan-brown-800 hover:bg-artisan-brown-300 dark:bg-artisan-brown-800 dark:text-artisan-brown-200 dark:hover:bg-artisan-brown-700",
      ghost:
        "hover:bg-artisan-gold-100 hover:text-artisan-gold-900 dark:hover:bg-artisan-gold-900 dark:hover:text-artisan-gold-100",
      link: "text-artisan-gold-500 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-artisan-brown-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-artisan-gold-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
