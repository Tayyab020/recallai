import React from 'react';
import clsx from 'clsx';

// Minimal shadcn-like Button using Tailwind classes
export const Button = ({
  as: As = 'button',
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none';

  const variants = {
    default: 'bg-pink-500 text-white hover:brightness-110 focus:ring-pink-500 focus:ring-offset-zinc-900',
    outline: 'border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 focus:ring-pink-500 focus:ring-offset-zinc-900',
    ghost: 'text-zinc-200 hover:bg-zinc-800/60 focus:ring-pink-500 focus:ring-offset-zinc-900',
    secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 focus:ring-zinc-600 focus:ring-offset-zinc-900'
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-11 px-6 text-base'
  };

  return (
    <As className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </As>
  );
};

export default Button;


