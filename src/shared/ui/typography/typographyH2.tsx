import { ReactNode } from 'react';
import { cn } from '~/shared/lib';

export function TypographyH2({ children, classname }: { children: ReactNode; classname?: string }) {
  return (
    <h2 className={cn('scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0', classname)}>
      {children}
    </h2>
  );
}
