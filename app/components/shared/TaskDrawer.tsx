"use client"

import { useState, useEffect } from 'react';
import { User, WorkflowTask, CompanyApplication, PersonApplication, TrustApplication } from '@/types/workflow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { UserAvatar } from './UserAvatar';
import { formatDistanceToNow, format } from 'date-fns';
import { updateTaskStatus, updateTaskUserStatus, getApplicationForTask, resetTaskNotifications, updateTaskAction } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import usersData from '@/data/users.json';
import { Icon } from '@/components/ui/Icon';
import { getPriorityIcon } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { GeneralBadge } from './GeneralBadge';
import { DetailTabs } from './DetailTabs';

interface TaskDrawerProps {
  task: WorkflowTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate?: () => void;
  showActions?: boolean;
}

export function TaskDrawer({ task, open, onOpenChange, onTaskUpdate, showActions }: TaskDrawerProps) {
  const { user: currentUser, hasRole } = useAuth();
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [tempAssignedUserId, setTempAssignedUserId] = useState<string>(task?.assignedTo || '');
  const [application, setApplication] = useState<CompanyApplication | PersonApplication | TrustApplication | undefined>(undefined);
  const [editActionOpen, setEditActionOpen] = useState(false);
  const [tempAction, setTempAction] = useState<string>(task?.actionTaken || '');
  
  useEffect(() => {
    if (task) {
      setTempAssignedUserId(task.assignedTo || '');
      // Load application
      const app = getApplicationForTask(task.id);
      setApplication(app);
    }
  }, [task]);

  // Reset notifications when drawer opens
  useEffect(() => {
    if (open && task && task.notifications && task.notifications > 0) {
      resetTaskNotifications(task.id);
      onTaskUpdate?.();
    }
  }, [open, task]);

  if (!task) return null;

  // Determine if actions should be shown based on role
  // Executors can perform actions, overseers are view-only
  // If task is completed, no actions should be shown
  const shouldShowActions = task.status === 'Completed' 
    ? false 
    : showActions !== undefined 
      ? showActions 
      : hasRole('executor');
  
  const handleDialogClose = (open: boolean) => {
    if (!open && task) {
      // When dialog is closing, update userStatus based on task status
      if (task.status === 'Completed') {
        updateTaskUserStatus(task.id, 'Completed');
      } else {
        // If not completed, set to Stashed when closing
        updateTaskUserStatus(task.id, 'Stashed');
      }
      onTaskUpdate?.();
    }
    onOpenChange(open);
  };

  const assignedUser = ((usersData as unknown) as User[]).find(u => u.id === task.assignedTo);
  const dueByText = task.dueBy
    ? formatDistanceToNow(new Date(task.dueBy), { addSuffix: true })
    : null;

  const handleAction = async (action: 'Approve' | 'Reject' | 'SendBack' | 'Done') => {
    if (!task) return;
    
    let newStatus: typeof task.status = task.status;
    if (action === 'Done' || action === 'Approve' || action === 'Reject' || action === 'SendBack') {
      newStatus = 'Completed';
    } 

    const updatedTask = updateTaskStatus(task.id, newStatus);
    if (newStatus === 'Completed' && updatedTask) {
      updatedTask.completedAt = new Date().toISOString();
    }
    
    onTaskUpdate?.();
    onOpenChange(false);
  };

  const handleEditAction = () => {
    setEditActionOpen(true);
  };

  const handleSaveAction = () => {
    if (!task) return;
    const updatedTask = updateTaskAction(task.id, tempAction);
    if (updatedTask) {
      setTempAction(updatedTask.actionTaken || '');
    }
  };


  const handleReassign = () => {
    if (!task || !tempAssignedUserId) return;
    // TODO: Implement task reassignment logic for now, just close the edit mode
    setEditUserOpen(false);
    onTaskUpdate?.();
  };

  const priorityIcon = getPriorityIcon(task.priority);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span>{task.title}</span>
            <GeneralBadge type="taskId" value={task.id} />
          </DialogTitle>
          <DialogDescription>
            
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Priority</h3>
              {task.priority} 
              <Icon 
              name={priorityIcon.icon} 
              className={cn("w-4 h-4 mt-0.5 flex-shrink-0", priorityIcon.color, "opacity-90")}
            />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <StatusBadge status={task.status} />
              
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Due Date</h3>
              <p className="text-sm text-muted-foreground">
                {task.dueBy ? (
                  <>
                    {format(new Date(task.dueBy), 'PPp')}
                    <br />
                    <span className="text-xs">({dueByText})</span>
                  </>
                ) : (
                  'No due date'
                )}
              </p>
            </div>
          </div>

          {hasRole('overseer') && (
            <div>
              <h3 className="font-semibold mb-2">Assigned To</h3>
              <div className="flex items-center gap-2">
                {!editUserOpen ? (
                  <>
                    <UserAvatar user={assignedUser} />
                    <span>{assignedUser?.name || 'Unassigned'}</span>
                    <Button variant="outline" size="icon" onClick={() => setEditUserOpen(true)}>
                      <Icon name="edit-2-line" className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Select value={tempAssignedUserId} onValueChange={setTempAssignedUserId}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {((usersData as unknown) as User[])
                          .filter((user) => user.id && user.id.trim() !== '')
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={handleReassign}>
                      Reassign
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditUserOpen(false)}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {shouldShowActions && (
            <div>
              <h3 className="font-semibold mb-2">Actions</h3>
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
                {task.status === 'In Progress' && (
                  <>
                    <Button onClick={() => handleAction('Done')} variant="default">
                      Done
                    </Button>
                    <Button onClick={() => handleAction('SendBack')} variant="outline">
                      Send Back
                    </Button>
                  </>
                )}
                {task.status === 'Stashed' && (
                  <Button onClick={() => handleAction('Approve')} variant="default">
                    Resume
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {!shouldShowActions && (
            <div className="text-sm text-muted-foreground italic">
              {task.status === 'Completed' 
                ? 'This task is completed with the action ' + <span className="text-md text-muted-foreground">{task?.actionTaken && task.actionTaken !== '' ? task.actionTaken : 'No action taken'}</span> + ' and cannot be modified'
                : hasRole('overseer')
                  ? (
                    <>
                    'This task is completed with the action ' + <span className="text-md text-muted-foreground">{task?.actionTaken && task.actionTaken !== '' ? task.actionTaken : 'No action taken'}</span> + ' and cannot be modified' 
                    <span className="text-xs text-muted-foreground">
                      <Button variant="outline" size="sm" onClick={() => setEditActionOpen(true)}>Override</Button>
                    </span>
                    </>
                  )
                  : null}
            </div>
          )}

          <DetailTabs 
            taskId={task.id}
            application={application || null}
            onCommentAdded={onTaskUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

