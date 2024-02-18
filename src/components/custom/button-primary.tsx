import { cn } from '@/lib/utils';
import React from 'react';

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        'rounded text-primary-foreground py-1 px-4 bg-primary transition duration-300 hover:bg-primary/60 active:scale-95',
        className
      )}
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
