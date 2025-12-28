"use client"

import { WorkflowInstance, WorkflowProcess } from '@/types/workflow';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Icon } from '@/components/ui/Icon';
import { cn, getPriorityIcon } from '@/lib/utils';
import { getTasksByInstance, getStepsByProcess } from '@/lib/dataService';

interface InstanceListItemProps {
  instance: WorkflowInstance;
  process: WorkflowProcess | undefined;
  isSelected: boolean;
  onClick: () => void;
}

export function InstanceListItem({ 
  instance, 
  process, 
  isSelected, 
  onClick 
}: InstanceListItemProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'inprogress' || statusLower === 'in progress') {
      return 'bg-blue-100 text-blue-800';
    } else if (statusLower === 'completed') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const processName = process?.name || 'Unknown Process';
  const priorityIcon = getPriorityIcon(instance.priority);
  const initials = getInitials(processName);
  const formattedDate = format(new Date(instance.startedAt), 'd MMM');

  // Calculate completion percentage
  const tasks = getTasksByInstance(instance.id);
  const steps = process ? getStepsByProcess(process.id) : [];
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalSteps = steps.length;
  const completionPercentage = totalSteps > 0 ? Math.round((completedTasks / totalSteps) * 100) : 0;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors",
        isSelected && "bg-teal-50 border-l-4 border-l-teal-500"
      )}
      onClick={onClick}
    >

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm text-gray-900">
            {processName}
          </span>
          {/* put priority icon */}
          <Icon name={priorityIcon.icon} className="w-4 h-4" />
          <Badge 
            variant="outline" 
            className={cn("text-xs", getStatusColor(instance.status))}
          >
            {instance.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-1">
          {instance.entityType} ({instance.entityId})
        </p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          Instance ID: {instance.id}
        </p>
      </div>

      {/* Date and Actions */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
        <div className="text-xs font-semibold text-gray-700">
          {completionPercentage}%
        </div>
        <div className="text-xs font-semibold text-gray-700">
        Tasks: {completedTasks}/{totalSteps}
        </div>
        
      </div>
    </div>
  );
}

