"use client"

import { TaskPriority } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const colorMap: Record<TaskPriority, string> = {
    'Urgent': 'bg-red-100 text-red-800',
    'Overdue': 'bg-orange-100 text-orange-800',
    'Important': 'bg-purple-100 text-purple-800',
    'Can do Later': 'bg-blue-100 text-blue-800',
    'Not important': 'bg-gray-100 text-gray-800',
  };

  const iconMap: Record<TaskPriority, string> = {
    'Urgent': 'error-warning',
    'Overdue': 'alarm-line',
    'Important': 'star-line',
    'Can do Later': 'check-line',
    'Not important': 'checkbox-blank-circle-line',
  };

  return (
    <Badge
      variant="outline"
      className={cn(colorMap[priority], className, "flex items-center gap-1")}
      title={priority}
    >
      <Icon name={iconMap[priority]} className="w-3.5 h-3.5" />
    </Badge>
  );
}

