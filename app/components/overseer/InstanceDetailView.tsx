"use client"

import { WorkflowInstance, WorkflowProcess, WorkflowTask, TaskPriority, InstanceStatus, WorkflowStep } from '@/types/workflow';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '@/components/shared/PriorityBadge';
import { TaskTimeline } from './TaskTimeline';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DetailTabs } from '@/components/shared/DetailTabs';
import { getApplication, updateInstanceStatus, updateInstancePriority, getStepsByProcess } from '@/lib/dataService';
import { useState, useEffect } from 'react';
import { CompanyApplication, PersonApplication, TrustApplication } from '@/types/workflow';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface InstanceDetailViewProps {
  instance: WorkflowInstance | null;
  process: WorkflowProcess | undefined;
  tasks: WorkflowTask[];
  onTaskClick: (task: WorkflowTask) => void;
}

export function InstanceDetailView({ 
  instance, 
  process, 
  tasks, 
  onTaskClick 
}: InstanceDetailViewProps) {
  const [application, setApplication] = useState<CompanyApplication | PersonApplication | TrustApplication | null>(null);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [closeComment, setCloseComment] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | ''>('');
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [overrideType, setOverrideType] = useState<'skip' | 'perform-action' | 'reassign' | ''>('');

  useEffect(() => {
    if (instance) {
      const app = getApplication(instance.entityId);
      setApplication(app || null);
      setSelectedPriority(instance.priority);
    }
  }, [instance]);

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

  if (!instance) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No process selected</p>
          <p className="text-sm">Select a process from the list to view details</p>
        </div>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const processName = process?.name || 'Unknown Process';
  const initials = getInitials(processName);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">
                {processName}
              </h1>
              <Badge variant="outline" className={cn("text-xs", getStatusColor(instance.status))}>
                {instance.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{instance.priority}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Instance ID: {instance.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Icon name="more-2-line" className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCloseModalOpen(true)}>
                  <Icon name="close-line" className="w-4 h-4 mr-2" />
                  Close Process
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityModalOpen(true)}>
                  <Icon name="star-line" className="w-4 h-4 mr-2" />
                  Change Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOverrideModalOpen(true)}>
                  <Icon name="settings-3-line" className="w-4 h-4 mr-2" />
                  Override Step
                </DropdownMenuItem>
                {instance.status === 'Completed' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      if (instance) {
                        updateInstanceStatus(instance.id, 'In Progress');
                        // Force re-render by updating the instance
                        window.location.reload();
                      }
                    }}>
                      <Icon name="refresh-line" className="w-4 h-4 mr-2" />
                      Re-open
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Sender/Entity Info */}
        {/* <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{processName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>to me</span>
              <Icon name="arrow-down-s-line" className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>{format(new Date(instance.startedAt), 'MMM d, h:mm a')}</span>
              <Icon name="star-line" className="w-4 h-4 text-yellow-500" />
              <Icon name="more-2-line" className="w-4 h-4" />
            </div>
            {instance.completedAt && (
              <div className="flex items-center gap-2">
                <span>{format(new Date(instance.completedAt), 'MMM d, h:mm a')}</span>
                <Icon name="star-line" className="w-4 h-4 text-yellow-500" />
                <Icon name="more-2-line" className="w-4 h-4" />
              </div>
            )}
          </div>
        </div> */}
      </div>

      {/* Content */}
      <div id="instance-detail-view-content" className="flex-1 overflow-y-auto p-6">
        {/* Detail Tabs */}
        <div className="border-t mb-6">
          <DetailTabs 
            instanceId={instance.id}
            application={application}
          />
        </div>

        {/* Tasks Timeline */}
        <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Task Timeline</h2>
          <TaskTimeline tasks={tasks} processId={process?.id} onTaskClick={onTaskClick} />
        </div>

        
      </div>

      {/* Close Modal */}
      <Dialog open={closeModalOpen} onOpenChange={setCloseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Instance</DialogTitle>
            <DialogDescription>
              Add a comment before closing this instance. This will change the status to "Stashed".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="close-comment">Comment</Label>
              <Textarea
                id="close-comment"
                placeholder="Enter a comment..."
                value={closeComment}
                onChange={(e) => setCloseComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCloseModalOpen(false);
              setCloseComment('');
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (instance && closeComment.trim()) {
                updateInstanceStatus(instance.id, 'Stashed');
                setCloseModalOpen(false);
                setCloseComment('');
                window.location.reload();
              }
            }} disabled={!closeComment.trim()}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Priority Modal */}
      <Dialog open={priorityModalOpen} onOpenChange={setPriorityModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Priority</DialogTitle>
            <DialogDescription>
              Select a new priority for this instance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="priority-select">Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setSelectedPriority(value as TaskPriority)}
              >
                <SelectTrigger id="priority-select">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Important">Important</SelectItem>
                  <SelectItem value="Can do Later">Can do Later</SelectItem>
                  <SelectItem value="Not important">Not important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setPriorityModalOpen(false);
              if (instance) {
                setSelectedPriority(instance.priority);
              }
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (instance && selectedPriority) {
                updateInstancePriority(instance.id, selectedPriority as TaskPriority);
                setPriorityModalOpen(false);
                window.location.reload();
              }
            }} disabled={!selectedPriority}>
              Change Priority
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Override Step Modal */}
      <Dialog open={overrideModalOpen} onOpenChange={setOverrideModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Override Step</DialogTitle>
            <DialogDescription>
              Select a step to override and choose the override type.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="step-select">Step</Label>
              <Select
                value={selectedStep}
                onValueChange={setSelectedStep}
              >
                <SelectTrigger id="step-select">
                  <SelectValue placeholder="Select a step" />
                </SelectTrigger>
                <SelectContent>
                  {process && getStepsByProcess(process.id).map((step) => (
                    <SelectItem key={step.id} value={step.id}>
                      {step.order}. {step.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="override-type-select">Override Type</Label>
              <Select
                value={overrideType}
                onValueChange={(value) => setOverrideType(value as 'skip' | 'perform-action' | 'reassign')}
              >
                <SelectTrigger id="override-type-select">
                  <SelectValue placeholder="Select override type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skip">Skip</SelectItem>
                  <SelectItem value="perform-action">Perform Action</SelectItem>
                  <SelectItem value="reassign">Reassign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setOverrideModalOpen(false);
              setSelectedStep('');
              setOverrideType('');
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (instance && selectedStep && overrideType) {
                // TODO: Implement override step logic
                console.log('Override step:', { instanceId: instance.id, stepId: selectedStep, type: overrideType });
                setOverrideModalOpen(false);
                setSelectedStep('');
                setOverrideType('');
                // window.location.reload();
              }
            }} disabled={!selectedStep || !overrideType}>
              Override Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

