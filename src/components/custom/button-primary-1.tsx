import { cn } from '@/lib/utils';
import React from 'react';

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const ButtonPrimary1: React.FC<ButtonPrimaryProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className="p-[1px] relative group"
    >
      <div className="absolute inset-0 bg-gradient rounded-lg transform group-hover:-translate-y-[2px] transition duration-400" />
      <div
        className={cn(
          'px-6 py-2 bg-background rounded-[6px]  relative group transition text-white hover:bg-transparent transform group-hover:-translate-y-[2px] duration-400',
          className
        )}
      >
        {children}
      </div>
    </button>
  );
};

export default ButtonPrimary1;
