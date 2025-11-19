import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: 'section' | 'div' | 'article' | 'aside';
}

export const Section: React.FC<SectionProps> = ({ 
  id, 
  className, 
  children, 
  as: Component = 'section' 
}) => {
  return (
    <Component
      id={id}
      className={cn('w-full', className)}
    >
      {children}
    </Component>
  );
};

Section.displayName = 'Section';

export interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ className, children }) => {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
};

Container.displayName = 'Container';
