"use client"

import { WorkflowTask, TaskPriority, User } from '@/types/workflow';
import { Card } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { GeneralBadge } from './GeneralBadge';
import { UserAvatar } from './UserAvatar';
import { Icon } from '@/components/ui/Icon';
import { Tooltip } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { cn, getPriorityColor, getPriorityIcon } from '@/lib/utils';
import usersData from '@/data/users.json';
import { useAuth } from '@/contexts/AuthContext';
import { getTimeLeft } from '@/lib/utils';

interface TaskCardProps {
  task: WorkflowTask;
  onClick?: () => void;
  className?: string;
}

export function TaskCard({ task, onClick, className}: TaskCardProps) {
  const { user: currentUser } = useAuth();
  const assignedUser = usersData.find(u => u.id === task.assignedTo);
  const dueByText = task.dueBy
    ? formatDistanceToNow(new Date(task.dueBy), { addSuffix: true })
    : null;





  const priorityIcon = getPriorityIcon(task.priority);
  const priorityBarColor = getPriorityColor(task.priority);

  const priorityColorMap: Record<TaskPriority, string> = {
    'Urgent': 'bg-red-500 text-white',
    'Overdue': 'bg-orange-500 text-white',
    'Important': 'bg-purple-500 text-white',
    'Can do Later': 'bg-blue-500 text-white',
    'Not important': 'bg-gray-500 text-white',
  };

  const priorityTooltipColor = priorityColorMap[task.priority];

  // Check if task is in view-only mode (completed)
  const isViewOnly = task.status === 'Completed';

  const notificationCount = task.notifications || 0;

  let progressPercentage = 100;
  let barColor = priorityBarColor;

  getTimeLeft(task);
  if (task?.timeLeft !== undefined) {
    // If overdue, show full bar in red
    if (task.priority == 'Overdue') {
      progressPercentage = 100;
      barColor = 'bg-red-500';
    } else if (task.timeLeft > 0) {
      // Calculate percentage: current timeLeft / original timeLeft
      progressPercentage = Math.min(Math.max((  task.timeLeft / (task.step?.sla ?? 0)) * 100, 0), 100);
    } else {
      progressPercentage = 0;
    }
  }

  return (
    <Tooltip
      content={task.priority}
      className={priorityTooltipColor}
    >
      <Card
        className={cn(
          "border-gray-300 p-4 cursor-pointer hover:shadow-md transition-shadow relative",
          isViewOnly && "bg-transparent shadow-none",
          className
        )}
        onClick={onClick}
      >
      {/* Progress bar at top border */}
      {task.timeLeft !== undefined && (
        <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-lg">
          <div className="h-full w-full bg-gray-200">
            <div
              className={cn("h-full transition-all duration-300", barColor)}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1">
            
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">{task.title}</h3>
            <Icon 
              name={priorityIcon.icon} 
              className={cn("w-4 h-4 mt-0.5 flex-shrink-0", priorityIcon.color, "opacity-90")}
            />
          </div>
          
        </div>
        <GeneralBadge type="taskId" value={task.id} />
        
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between gap-2">
        {/* Notification Bell Icon in bottom right corner */}
     
          <div className="relative">
            <Icon 
              name="notification-line" 
              className="w-4 h-4 text-muted-foreground"
            />
            {notificationCount > 0 && ( <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
            )}
          </div>
      
          {dueByText && (
            <span className="text-xs text-muted-foreground">
              Due {dueByText}
            </span>
          )}
        </div>
        
        {currentUser?.role == 'overseer' && assignedUser && (
          <div className="flex items-center gap-2">
            <UserAvatar user={{ ...assignedUser, avatar: assignedUser.avatar || undefined } as User} />
            <span className="text-xs text-muted-foreground">
              {assignedUser.name}
            </span>
          </div>
        )}
      </div>
    </Card>
    </Tooltip>
  );
}

