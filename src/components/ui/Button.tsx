import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-signal-500 text-console-950 hover:bg-signal-400 font-semibold shadow-[0_0_0_1px_rgba(0,0,0,0.2)]',
  secondary:
    'bg-console-800 text-console-100 border border-console-600 hover:bg-console-700',
  ghost: 'bg-transparent text-console-300 hover:text-console-100 hover:bg-console-800',
  danger: 'bg-transparent text-alert-500 hover:bg-alert-500/10',
  icon: 'bg-console-800 border border-console-700 text-console-200 hover:text-signal-400 hover:border-signal-500/40 rounded-full',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  md: 'text-sm px-4 py-2 rounded-lg gap-2',
  lg: 'text-base px-6 py-3 rounded-lg gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-500 focus-visible:outline-offset-2',
        variant !== 'icon' && sizeClasses[size],
        variant === 'icon' && 'p-2.5',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
