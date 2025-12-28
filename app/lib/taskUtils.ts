import { WorkflowTask, TaskStatus, TaskPriority } from '@/types/workflow';

export function getKanbanColumn(status: TaskStatus): string {
  switch (status) {
    case 'Pending':
      return 'Incoming';
    case 'In Progress':
      return 'In Progress';
    case 'Stashed':
      return 'Stashed';
    case 'Completed':
      return 'Completed';
    default:
      return 'Incoming';
  }
}

const priorityOrder: Record<TaskPriority, number> = {
  'Overdue': 1,
  'Urgent': 2,
  'Important': 3,
  'Can do Later': 4,
  'Not important': 5,
};

export function calculatePriority(task: WorkflowTask): number {
  return priorityOrder[task.priority] || 5;
}

export function sortTasksByPriority(tasks: WorkflowTask[]): WorkflowTask[] {
  return [...tasks].sort((a, b) => {
    const priorityDiff = calculatePriority(a) - calculatePriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    
    // If priorities are the same, sort by timeLeft ascending
    const timeLeftA = a.timeLeft ?? Infinity;
    const timeLeftB = b.timeLeft ?? Infinity;
    
    if (timeLeftA !== timeLeftB) {
      return timeLeftA - timeLeftB;
    }
    
    // If timeLeft is also the same, fall back to dueBy
    if (!a.dueBy && !b.dueBy) return 0;
    if (!a.dueBy) return 1;
    if (!b.dueBy) return -1;
    
    return new Date(a.dueBy).getTime() - new Date(b.dueBy).getTime();
  });
}

