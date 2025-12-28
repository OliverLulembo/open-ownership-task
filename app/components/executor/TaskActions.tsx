"use client"

import { WorkflowTask } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { updateTaskStatus } from '@/lib/dataService';

interface TaskActionsProps {
  task: WorkflowTask;
  onStatusChange?: () => void;
}

export function TaskActions({ task, onStatusChange }: TaskActionsProps) {
  const handleAction = (action: 'Approve' | 'Reject' | 'SendBack' | 'Done') => {
    let newStatus: typeof task.status = task.status;
    
    if (action === 'Done') {
      newStatus = 'Completed';
    } else if (action === 'Approve' && task.status === 'Pending') {
      newStatus = 'InProgress';
    } else if (action === 'Reject') {
      newStatus = 'stashed';
    } else if (action === 'SendBack' && task.status === 'InProgress') {
      newStatus = 'Pending';
    }

    updateTaskStatus(task.id, newStatus);
    onStatusChange?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {task.status === 'Pending' && (
        <>
          <Button onClick={() => handleAction('Approve')} variant="default">
            Approve
          </Button>
          <Button onClick={() => handleAction('Reject')} variant="destructive">
            Reject
          </Button>
          <Button onClick={() => handleAction('SendBack')} variant="outline">
            Send Back
          </Button>
        </>
      )}
      {task.status === 'InProgress' && (
        <>
          <Button onClick={() => handleAction('Done')} variant="default">
            Done
          </Button>
          <Button onClick={() => handleAction('SendBack')} variant="outline">
            Send Back
          </Button>
        </>
      )}
      {task.status === 'stashed' && (
        <Button onClick={() => handleAction('Approve')} variant="default">
          Resume
        </Button>
      )}
    </div>
  );
}

