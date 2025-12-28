"use client"

import { cn } from '@/lib/utils';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <i className={cn(`ri-${name}`, className)} />
  );
}

