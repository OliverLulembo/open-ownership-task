"use client"

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GeneralBadgeProps {
  type: 'taskId' | string;
  value: string;
  className?: string;
}

export function GeneralBadge({ type, value, className }: GeneralBadgeProps) {
  // Format the value based on type
  const formatValue = (type: string, value: string): string => {
    if (type === 'taskId') {
      // Convert "task-1" to "TASK-1" or keep as is if already formatted
      if (value.startsWith('task-')) {
        const id = value.replace('task-', '');
        return `TASK-${id}`;
      }
      return value.toUpperCase();
    }
    return value;
  };

  // Get styling based on type
  const getTypeStyles = (type: string): string => {
    if (type === 'taskId') {
      return 'bg-gray-200 text-gray-700';
    }
    return '';
  };

  const formattedValue = formatValue(type, value);
  const typeStyles = getTypeStyles(type);

  return (
    <Badge
      variant="outline"
      className={cn(typeStyles, className)}
    >
      {formattedValue}
    </Badge>
  );
}

