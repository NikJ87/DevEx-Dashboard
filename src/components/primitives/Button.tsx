import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { combineClasses } from '@/utils/combineClasses';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Quick inline tailwind v4 styles based on tokens
    const variants = {
      default: 'bg-[var(--color-primary)] text-[var(--color-primary-fg)] hover:opacity-90',
      destructive: 'bg-[var(--color-destructive)] text-white hover:opacity-90',
      outline:
        'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] hover:text-[var(--color-muted-fg)]',
      secondary: 'bg-[var(--color-muted)] text-[var(--color-muted-fg)] hover:opacity-80',
      ghost: 'hover:bg-[var(--color-muted)] hover:text-[var(--color-muted-fg)]',
      link: 'text-[var(--color-primary)] underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    return (
      <Comp
        className={combineClasses(
          'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
