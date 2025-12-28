"use client"

import { WorkflowInstance, WorkflowProcess, WorkflowTask } from '@/types/workflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InstanceCardProps {
  instance: WorkflowInstance;
  process: WorkflowProcess | undefined;
  tasks: WorkflowTask[];
  onClick: () => void;
  isSelected: boolean;
  onTaskClick?: (task: WorkflowTask) => void;
}

export function InstanceCard({ 
  instance, 
  process, 
  tasks, 
  onClick, 
  isSelected,
  onTaskClick 
}: InstanceCardProps) {
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

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-all",
        isSelected && "ring-2 ring-primary bg-accent"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{process?.name || 'Unknown Process'}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2 text-sm">
        <div>
          <span className="font-medium">Entity:</span>{' '}
          <span className="text-muted-foreground">
            {instance.entityType} ({instance.entityId})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant="outline" className={getStatusColor(instance.status)}>
            {instance.status}
          </Badge>
        </div>
        <div>
          <span className="font-medium">Tasks:</span>{' '}
          <span className="text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

