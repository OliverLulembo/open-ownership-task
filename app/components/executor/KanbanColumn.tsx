"use client"

import { WorkflowTask, UserStatus } from '@/types/workflow';
import { TaskCard } from '@/components/shared/TaskCard';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  title: string;
  userStatus: UserStatus;
  tasks: WorkflowTask[];
  onTaskClick: (task: WorkflowTask) => void;
  className?: string;
  icon: string;
}

export function KanbanColumn({ title, userStatus, tasks, onTaskClick, className, icon }: KanbanColumnProps) {
  // if (status === 'stashed' && tasks.length === 0) {
  //   return null;
  // }

  return (
    <div className="flex flex-col h-full track-background rounded-lg p-4" style={{ backgroundColor: 'var(--track-background)' }}>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-muted-foreground"><Icon name={icon} className="w-6 h-6" /></span>
        
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

