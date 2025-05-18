
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, isLoading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          {
            'bg-fimdefesta-primary text-white hover:bg-fimdefesta-primary/90': variant === 'default',
            'bg-transparent border border-fimdefesta-border text-fimdefesta-text hover:bg-fimdefesta-primary/10': variant === 'outline',
            'bg-transparent text-fimdefesta-text hover:bg-fimdefesta-surface': variant === 'ghost',
            'bg-transparent text-fimdefesta-primary underline-offset-4 hover:underline': variant === 'link',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'px-3 py-1 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'w-full': fullWidth,
            'cursor-not-allowed': props.disabled || isLoading,
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
