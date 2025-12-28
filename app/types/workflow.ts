export type UserRole = 'executor' | 'overseer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Stashed' | 'Completed' ;
export type TaskPriority = 'Urgent' | 'Overdue' | 'Important' | 'Can do Later' | 'Not important';
export type UserStatus = 'New' | 'Opened' | 'Stashed' | 'Completed';
export type InstanceStatus = 'Overdue' | 'In Progress' | 'Completed' | 'Stashed' | 'Delayed' | 'Pending';

export interface WorkflowProcess {
  id: string;
  name: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  processId: string;
  name: string;
  order: number;
  description?: string;
  actions: WorkflowStepAction[];
  roles: WorkflowStepRole[];
  nextStepId?: string;
  sla: number;
}

export interface WorkflowStepAction {
  id: string;
  name: string;
  type: 'Approve' | 'Reject' | 'SendBack' | 'Done';
  nextStepId?: string;
}

export interface WorkflowStepRole {
  role: UserRole;
  canExecute: boolean;
}

export interface WorkflowInstance {
  id: string;
  processId: string;
  entityType: string;
  entityId: string;
  status: InstanceStatus;
  priority: TaskPriority;
  currentStepId?: string;
  startedAt: string;
  completedAt?: string;
  createdBy: string;
}

export interface WorkflowTask {
  id: string;
  instanceId: string;
  stepId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueBy? : string;
  timeLeft?: number;
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userStatus: UserStatus;
  notifications: number;
  step?: WorkflowStep;
}

export interface WorkflowTaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTaskId?: string;
  relatedInstanceId?: string;
}

export interface WorkflowLog {
  id: string;
  instanceId: string;
  taskId?: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  references?: {
    taskIds?: string[];
    instanceIds?: string[];
  };
  createdAt: string;
}

export type CompanyType = 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship' | 'Non-Profit' | 'Trust';

export interface FileAttachment {
  id: string;
  applicationId: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  uploadedBy: string;
  uploadedAt: string;
  fileUrl?: string;
  description?: string;
}

export interface CompanyApplication {
  id: string;
  applicationNumber: string;
  companyType: CompanyType;
  companyName: string;
  registrationNumber?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  businessAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  registeredAddress?: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  businessDescription?: string;
  incorporationDate?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Pending Documents';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[]; // Array of file attachment IDs
}

export interface PersonApplication {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  nationality?: string;
  passportNumber?: string;
  nationalIdNumber?: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country: string;
    postalCode: string;
  };
  occupation?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Pending Documents';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[]; // Array of file attachment IDs
}

export interface TrustApplication {
  id: string;
  applicationNumber: string;
  trustName: string;
  trustType: string;
  settlorName: string;
  settlorEmail: string;
  settlorPhone?: string;
  trusteeName: string;
  trusteeEmail: string;
  beneficiaryCount?: number;
  trustPurpose?: string;
  establishmentDate?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Pending Documents';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[]; // Array of file attachment IDs
}

