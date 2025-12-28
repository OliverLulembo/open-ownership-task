"use client"

import { useState } from 'react';
import { WorkflowTask, TaskPriority, User } from '@/types/workflow';
import { Icon } from '@/components/ui/Icon';
import { UserAvatar } from './UserAvatar';
import { formatDistanceToNow, format } from 'date-fns';
import { cn, getPriorityIcon, getPriorityColor } from '@/lib/utils';
import usersData from '@/data/users.json';
import { useAuth } from '@/contexts/AuthContext';
import { getTimeLeft } from '@/lib/utils';
import { GeneralBadge } from './GeneralBadge';

interface TodoListItemProps {
  task: WorkflowTask;
  onClick?: () => void;
  className?: string;
}

export function TodoListItem({ task, onClick, className }: TodoListItemProps) {
  const { user: currentUser } = useAuth();
  const [isStarred, setIsStarred] = useState(false);
  const assignedUser = usersData.find(u => u.id === task.assignedTo);
  
  getTimeLeft(task);
  
  

  const dueByText = task.dueBy
    ? formatDistanceToNow(new Date(task.dueBy), { addSuffix: true })
    : null;

  const priorityColor = getPriorityColor(task.priority);
  const isCompleted = task.status === 'Completed';


  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer",
        isCompleted && "opacity-60",
        className
      )}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-colors flex items-center justify-center",
          isCompleted 
            ? "bg-primary border-primary" 
            : "border-gray-300 group-hover:border-primary"
        )}>
          {isCompleted ? (
            <Icon 
              name="check-line" 
              className="w-3 h-3 text-white" 
            />
          ) : (
            <Icon 
              name="check-line" 
              className="w-3 h-3 text-primary opacity-0 group-hover:opacity-50 transition-opacity" 
            />
          )}
        </div>
      </div>

      {/* Star Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsStarred(!isStarred);
        }}
        className="flex-shrink-0 text-yellow-400 hover:text-yellow-500 transition-colors"
      >
        <Icon 
          name={isStarred ? "star-fill" : "star-line"} 
          className={cn("w-5 h-5", isStarred && "fill-current")}
        />
      </button>

      {/* Priority Dot */}
      <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityColor)} />

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-sm truncate",
          isCompleted && "line-through text-gray-400"
        )}>
          {task.title}
        </h3>
      </div>

    

      {dueByText && (
            <span className="text-xs text-muted-foreground">
              Due {dueByText}
            </span>
          )}

      <GeneralBadge type="taskId" value={task.userStatus} />


      {/* Options Menu */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Handle options menu
        }}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <Icon name="more-2-line" className="w-5 h-5" />
      </button>
    </div>
  );
}

