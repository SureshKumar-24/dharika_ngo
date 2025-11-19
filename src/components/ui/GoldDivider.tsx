import React from 'react';
import { cn } from '@/lib/utils';

export interface GoldDividerProps {
  className?: string;
}

export const GoldDivider: React.FC<GoldDividerProps> = ({ className }) => {
  return (
    <div
      className={cn('w-full h-px bg-linear-to-r from-transparent via-gold to-transparent', className)}
      role="separator"
      aria-hidden="true"
    />
  );
};

GoldDivider.displayName = 'GoldDivider';
