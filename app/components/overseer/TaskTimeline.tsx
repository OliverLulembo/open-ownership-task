"use client"

import { WorkflowTask, WorkflowStep } from '@/types/workflow';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { getStepsByProcess } from '@/lib/dataService';

interface TaskTimelineProps {
  tasks: WorkflowTask[];
  processId?: string;
  onTaskClick: (task: WorkflowTask) => void;
}

interface TimelineItem {
  type: 'task' | 'step';
  step: WorkflowStep;
  task?: WorkflowTask;
  order: number;
}

export function TaskTimeline({ tasks, processId, onTaskClick }: TaskTimelineProps) {
  // Get all steps for the process
  const steps = processId ? getStepsByProcess(processId) : [];
  
  // Create a map of stepId to task
  const taskMap = new Map<string, WorkflowTask>();
  tasks.forEach(task => {
    if (task.stepId) {
      taskMap.set(task.stepId, task);
    }
  });

  // Create timeline items combining steps and tasks
  const timelineItems: TimelineItem[] = steps.map(step => ({
    type: taskMap.has(step.id) ? 'task' : 'step',
    step,
    task: taskMap.get(step.id),
    order: step.order
  }));

  // Sort by step order
  timelineItems.sort((a, b) => a.order - b.order);

  if (timelineItems.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No steps found for this process
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {timelineItems.map((item, index) => {
          const isTask = item.type === 'task' && item.task;
          
          return (
            <div key={item.step.id} className="relative flex items-start gap-4">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 border-background",
                  isTask && item.task?.status === 'Completed' 
                    ? "bg-green-500" 
                    : isTask && (item.task?.status === 'In Progress' || item.task?.status === 'Pending')
                    ? "bg-blue-500"
                    : isTask
                    ? "bg-gray-400"
                    : "bg-gray-300 border-dashed"
                )} />
              </div>

              {/* Task or Step card */}
              {isTask && item.task ? (
                <div 
                  className={cn(
                    "flex-1 bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow",
                    "hover:border-primary"
                  )}
                  onClick={() => onTaskClick(item.task!)}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold text-base flex-1">{item.task.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={item.task.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="calendar-line" className="w-3.5 h-3.5" />
                      <span>Created: {format(new Date(item.task.createdAt), 'PPp')}</span>
                    </div>
                    {item.task.completedAt && (
                      <div className="flex items-center gap-1">
                        <Icon name="check-double-line" className="w-3.5 h-3.5" />
                        <span>Completed: {format(new Date(item.task.completedAt), 'PPp')}</span>
                      </div>
                    )}
                    {item.task.dueBy && (
                      <div className="flex items-center gap-1">
                        <Icon name="time-line" className="w-3.5 h-3.5" />
                        <span>Due: {format(new Date(item.task.dueBy), 'PPp')}</span>
                      </div>
                    )}
                    {item.task.assignedTo && (
                      <div className="flex items-center gap-1">
                        <Icon name="user-line" className="w-3.5 h-3.5" />
                        <span>Assigned</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-card border border-dashed rounded-lg p-4 opacity-60">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-base text-muted-foreground">{item.step.name}</h4>
                      {item.step.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.step.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground italic">Not yet created</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <Icon name="time-line" className="w-3.5 h-3.5" />
                      <span>SLA: {item.step.sla} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="list-ordered" className="w-3.5 h-3.5" />
                      <span>Step {item.step.order}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

