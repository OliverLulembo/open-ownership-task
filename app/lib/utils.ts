import { WorkflowTask, TaskPriority } from "@/types/workflow";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeLeft(task: WorkflowTask) {
  const now = new Date();
  const dueBy = new Date(task.dueBy??'');
  if (isNaN(dueBy.getTime())) {
    return null;
  }
  const timeLeft = dueBy.getTime() - now.getTime();
  //convert time left to hours
  const timeLeftHours = timeLeft / (1000 * 60 * 60);
  if (timeLeft < 0) {
    task.timeLeft = timeLeftHours;
    task.priority = 'Overdue';
  } else {
    task.timeLeft = timeLeftHours;
  }
}


export function getPriorityColor(priority: TaskPriority): string {
  return priorityColorMap[priority];
}
const priorityColorMap: Record<TaskPriority, string> = {
  'Urgent': 'bg-red-500',
  'Overdue': 'bg-orange-500',
  'Important': 'bg-purple-500',
  'Can do Later': 'bg-blue-500',
  'Not important': 'bg-gray-400',
};

const priorityIconMap: Record<TaskPriority, { icon: string; color: string }> = {
  'Overdue': { icon: 'error-warning-line', color: 'text-red-500' },
  'Urgent': { icon: 'time-line', color: 'text-orange-500' },
  'Important': { icon: 'star-line', color: 'text-purple-500' },
  'Can do Later': { icon: 'check-line', color: 'text-blue-500' },
  'Not important': { icon: 'checkbox-blank-circle-line', color: 'text-gray-400' },
};

export function getPriorityIcon(priority: TaskPriority): { icon: string; color: string } {
  return priorityIconMap[priority];
}
