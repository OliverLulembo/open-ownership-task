"use client"

import { TaskStatus } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variantMap: Record<TaskStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Pending': 'secondary',
    'In Progress': 'default',
    'Stashed': 'outline',
    'Completed': 'default',
  };

  const colorMap: Record<TaskStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Stashed': 'bg-gray-100 text-gray-800',
    'Completed': 'bg-green-100 text-green-800',
  };

  return (
    <Badge
      variant={variantMap[status]}
      className={cn(colorMap[status], className)}
    >
      {status}
    </Badge>
  );
}

