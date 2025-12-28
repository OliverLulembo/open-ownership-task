import { 
  WorkflowTask, 
  WorkflowInstance, 
  WorkflowProcess, 
  WorkflowStep,
  WorkflowTaskComment,
  WorkflowLog,
  Message,
  TaskStatus,
  TaskPriority,
  InstanceStatus,
  CompanyApplication,
  PersonApplication,
  TrustApplication,
  FileAttachment
} from '@/types/workflow';
import { extractTaskIds, extractInstanceIds } from './references';

// Import JSON data
import processesData from '@/data/processes.json';
import stepsData from '@/data/steps.json';
import instancesData from '@/data/instances.json';
import tasksData from '@/data/tasks.json';
import commentsData from '@/data/comments.json';
import messagesData from '@/data/messages.json';
import logsData from '@/data/logs.json';
import applicationsData from '@/data/applications.json';
import attachmentsData from '@/data/attachments.json';

// Type assertions - create mutable copies for in-memory updates
let processes = [...(processesData as WorkflowProcess[])];
let steps = [...(stepsData as WorkflowStep[])];
let instances = [...(instancesData as WorkflowInstance[])];
let tasks = [...(tasksData as WorkflowTask[])];
let comments = [...(commentsData as WorkflowTaskComment[])];
let messages = [...(messagesData as Message[])];
let logs = [...(logsData as WorkflowLog[])];
let applications = [...(applicationsData as (CompanyApplication | PersonApplication | TrustApplication)[])];
let attachments = [...(attachmentsData as FileAttachment[])];

export function getProcesses(): WorkflowProcess[] {
  return processes;
}

export function getProcess(id: string): WorkflowProcess | undefined {
  return processes.find(p => p.id === id);
}

export function getSteps(): WorkflowStep[] {
  return steps;
}

export function getStepsByProcess(processId: string): WorkflowStep[] {
  return steps.filter(s => s.processId === processId);
}

export function getInstances(): WorkflowInstance[] {
  return instances;
}

export function getInstance(id: string): WorkflowInstance | undefined {
  return instances.find(i => i.id === id);
}

export function getTasks(): WorkflowTask[] {
  return tasks;
}

export function getTask(id: string): WorkflowTask | undefined {
  return tasks.find(t => t.id === id);
}

export function getTasksByInstance(instanceId: string): WorkflowTask[] {
  return tasks.filter(t => t.instanceId === instanceId);
}

export function getTasksByUser(userId: string): WorkflowTask[] {
  return tasks.filter(t => t.assignedTo === userId);
}

export function getTasksByStatus(status: TaskStatus): WorkflowTask[] {
  return tasks.filter(t => t.status === status);
}

export function updateTaskStatus(taskId: string, status: TaskStatus): WorkflowTask | null {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;
  
  const previousStatus = task.status;
  task.status = status;
  task.updatedAt = new Date().toISOString();
  
  // Update completedAt when task is completed
  if (status === 'Completed') {
    task.completedAt = new Date().toISOString();
    task.userStatus = 'Completed';
  }
  
  // Increment notification count if status changed
  if (previousStatus !== status) {
    task.notifications = (task.notifications || 0) + 1;
  }
  
  return task;
}


export function updateTaskUserStatus(taskId: string, userStatus: 'New' | 'Opened' | 'Stashed' | 'Completed'): WorkflowTask | null {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;
  
  task.userStatus = userStatus;
  task.updatedAt = new Date().toISOString();
  
  return task;
}

export function updateTaskAction(taskId: string, action: string): WorkflowTask | null {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;
  task.actionTaken = action;
  task.updatedAt = new Date().toISOString();
  return task;
}

export function resetTaskNotifications(taskId: string): WorkflowTask | null {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;
  task.notifications = 0;
  task.updatedAt = new Date().toISOString();
  return task;
}

export function getCommentsByTask(taskId: string): WorkflowTaskComment[] {
  return comments.filter(c => c.taskId === taskId);
}

export function addComment(taskId: string, userId: string, content: string): WorkflowTaskComment {
  const comment: WorkflowTaskComment = {
    id: `comment-${Date.now()}`,
    taskId,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };
  
  comments.push(comment);
  
  // Increment notification count for the task
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.notifications = (task.notifications || 0) + 1;
  }
  
  return comment;
}

export function getMessages(): Message[] {
  return messages;
}

export function addMessage(userId: string, content: string): Message {
  const message: Message = {
    id: `msg-${Date.now()}`,
    userId,
    content,
    references: {
      taskIds: extractTaskIds(content),
      instanceIds: extractInstanceIds(content),
    },
    createdAt: new Date().toISOString(),
  };
  
  messages.push(message);
  return message;
}

export function sortTasksByPriority(tasks: WorkflowTask[]): WorkflowTask[] {
  return tasks.sort((a, b) => {
    return (b.timeLeft??0) - (a.timeLeft??0);
  });
}

export function filterInstances(filters: {
  processType?: string;
  status?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}): WorkflowInstance[] {
  return instances.filter(instance => {
    if (filters.processType) {
      const process = getProcess(instance.processId);
      if (process?.type !== filters.processType) return false;
    }
    
    if (filters.status && instance.status !== filters.status) return false;
    
    if (filters.entityType && instance.entityType !== filters.entityType) return false;
    
    if (filters.dateFrom) {
      const startDate = new Date(instance.startedAt);
      const fromDate = new Date(filters.dateFrom);
      if (startDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const startDate = new Date(instance.startedAt);
      const toDate = new Date(filters.dateTo);
      if (startDate > toDate) return false;
    }
    
    return true;
  });
}

/**
 * Calculate the number of notifications for a task based on:
 * - New comments added after the task was last updated
 * - State changes logged after the task was last updated
 */
export function calculateTaskNotifications(taskId: string, taskUpdatedAt: string): number {
  let count = 0;
  
  // Count comments created after task was last updated
  const taskComments = comments.filter(c => c.taskId === taskId);
  const newComments = taskComments.filter(c => 
    new Date(c.createdAt) > new Date(taskUpdatedAt)
  );
  count += newComments.length;
  
  // Count state changes logged after task was last updated
  const taskLogs = logs.filter(l => l.taskId === taskId);
  const stateChangeLogs = taskLogs.filter(l => {
    const isStateChange = l.action.includes('Status Changed') || 
                         l.action.includes('Task Completed') ||
                         l.action.includes('Task Created');
    return isStateChange && new Date(l.createdAt) > new Date(taskUpdatedAt);
  });
  count += stateChangeLogs.length;
  
  return count;
}

/**
 * Get the notification count for a task, using the stored value or calculating it
 */
export function getTaskNotifications(taskId: string): number {
  const task = getTask(taskId);
  if (!task) return 0;
  
  // Use stored notifications value, or calculate if not available
  if (task.notifications !== undefined) {
    return task.notifications;
  }
  
  return calculateTaskNotifications(taskId, task.updatedAt);
}

/**
 * Get application by ID
 */
export function getApplication(applicationId: string): CompanyApplication | PersonApplication | TrustApplication | undefined {
  return applications.find(app => app.id === applicationId);
}

/**
 * Update instance status
 */
export function updateInstanceStatus(instanceId: string, status: InstanceStatus): WorkflowInstance | null {
  const instance = instances.find(i => i.id === instanceId);
  if (!instance) return null;
  
  instance.status = status;
  if (status === 'Completed' && !instance.completedAt) {
    instance.completedAt = new Date().toISOString();
  } else if (status !== 'Completed') {
    instance.completedAt = undefined;
  }
  
  return instance;
}

/**
 * Update instance priority
 */
export function updateInstancePriority(instanceId: string, priority: TaskPriority): WorkflowInstance | null {
  const instance = instances.find(i => i.id === instanceId);
  if (!instance) return null;
  
  instance.priority = priority;
  
  return instance;
}

/**
 * Get attachments by application ID
 */
export function getAttachmentsByApplication(applicationId: string): FileAttachment[] {
  return attachments.filter(att => att.applicationId === applicationId);
}

/**
 * Get application for a task (via instance)
 */
export function getApplicationForTask(taskId: string): CompanyApplication | PersonApplication | TrustApplication | undefined {
  const task = getTask(taskId);
  if (!task) return undefined;
  
  const instance = getInstance(task.instanceId);
  if (!instance) return undefined;
  
  return getApplication(instance.entityId);
}

