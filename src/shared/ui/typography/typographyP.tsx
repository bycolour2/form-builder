import { ReactNode } from 'react';
import { cn } from '~/shared/lib';

export function TypographyP({ children, classname }: { children: ReactNode; classname?: string }) {
  return <p className={cn('whitespace-pre-wrap leading-7 [&:not(:first-child)]:mt-6', classname)}>{children}</p>;
}
