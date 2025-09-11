import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'w-full h-11 px-3 rounded-md bg-zinc-900/60 border border-zinc-800 text-zinc-100 placeholder-zinc-500',
      'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500',
      'transition-colors',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;


