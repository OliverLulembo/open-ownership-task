"use client"

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/Icon';
import { UserAvatar } from './UserAvatar';
import { format } from 'date-fns';
import { 
  WorkflowTaskComment, 
  CompanyApplication, 
  PersonApplication, 
  TrustApplication, 
  FileAttachment,
  User,
  WorkflowTask
} from '@/types/workflow';
import { 
  getCommentsByTask, 
  addComment, 
  getApplication, 
  getAttachmentsByApplication,
  getTasksByInstance,
  getInstance
} from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import usersData from '@/data/users.json';

interface DetailTabsProps {
  taskId?: string;
  instanceId?: string;
  comments?: WorkflowTaskComment[];
  application?: CompanyApplication | PersonApplication | TrustApplication | null;
  attachments?: FileAttachment[];
  onCommentAdded?: () => void;
}

export function DetailTabs({ 
  taskId, 
  instanceId,
  comments: initialComments,
  application: initialApplication,
  attachments: initialAttachments,
  onCommentAdded
}: DetailTabsProps) {
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState<WorkflowTaskComment[]>(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<CompanyApplication | PersonApplication | TrustApplication | null>(
    initialApplication || null
  );
  const [attachments, setAttachments] = useState<FileAttachment[]>(initialAttachments || []);

  useEffect(() => {
    if (taskId) {
      // Load task-specific data
      const taskComments = getCommentsByTask(taskId);
      setComments(taskComments);
    } else if (instanceId) {
      // Load instance-specific data
      // Get all comments from tasks in this instance
      const instanceTasks = getTasksByInstance(instanceId);
      const allComments: WorkflowTaskComment[] = [];
      instanceTasks.forEach(task => {
        const taskComments = getCommentsByTask(task.id);
        allComments.push(...taskComments);
      });
      setComments(allComments);
    }
  }, [taskId, instanceId]);

  useEffect(() => {
    if (application) {
      const atts = getAttachmentsByApplication(application.id);
      setAttachments(atts);
    }
  }, [application]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    
    if (taskId) {
      setIsSubmitting(true);
      addComment(taskId, currentUser.id, newComment);
      const updatedComments = getCommentsByTask(taskId);
      setComments(updatedComments);
      setNewComment('');
      setIsSubmitting(false);
      onCommentAdded?.();
    } else if (instanceId) {
      // For instances, we could add comments to the first task or create instance-level comments
      // For now, we'll add to the first task if available
      const instanceTasks = getTasksByInstance(instanceId);
      if (instanceTasks.length > 0) {
        setIsSubmitting(true);
        addComment(instanceTasks[0].id, currentUser.id, newComment);
        const allComments: WorkflowTaskComment[] = [];
        instanceTasks.forEach(task => {
          const taskComments = getCommentsByTask(task.id);
          allComments.push(...taskComments);
        });
        setComments(allComments);
        setNewComment('');
        setIsSubmitting(false);
        onCommentAdded?.();
      }
    }
  };

  return (
    <Tabs defaultValue="job-card" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-primary">
        <TabsTrigger value="job-card">Job Card</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>  
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
        <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
      </TabsList>
      
      <TabsContent value="comments" className="mt-4">
        <div className="space-y-3 mb-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map(comment => {
              const commentUser = ((usersData as unknown) as User[]).find(u => u.id === comment.userId);
              return (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UserAvatar user={commentUser} />
                    <span className="text-sm font-medium">
                      {commentUser?.name || 'Unknown'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              );
            })
          )}
        </div>
        
        {currentUser && (
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              Add
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="job-card" className="mt-4">
        <div className="space-y-4">
          {application ? (
            <>
              <div>
                <h4 className="font-semibold mb-2">Application Details</h4>
                <div className="space-y-2 text-sm">
                  {'applicationNumber' in application && (
                    <p><span className="font-medium">Application Number:</span> {application.applicationNumber}</p>
                  )}
                  {'companyName' in application && (
                    <>
                      <p><span className="font-medium">Company Name:</span> {application.companyName}</p>
                      <p><span className="font-medium">Company Type:</span> {application.companyType}</p>
                      {application.registrationNumber && (
                        <p><span className="font-medium">Registration Number:</span> {application.registrationNumber}</p>
                      )}
                    </>
                  )}
                  {'firstName' in application && (
                    <>
                      <p><span className="font-medium">Name:</span> {application.firstName} {application.middleName} {application.lastName}</p>
                      {application.nationality && (
                        <p><span className="font-medium">Nationality:</span> {application.nationality}</p>
                      )}
                    </>
                  )}
                  {'trustName' in application && (
                    <>
                      <p><span className="font-medium">Trust Name:</span> {application.trustName}</p>
                      <p><span className="font-medium">Trust Type:</span> {application.trustType}</p>
                    </>
                  )}
                  <p><span className="font-medium">Status:</span> {application.status}</p>
                  {application.submittedAt && (
                    <p><span className="font-medium">Submitted:</span> {format(new Date(application.submittedAt), 'PPp')}</p>
                  )}
                </div>
              </div>
              {'businessDescription' in application && application.businessDescription && (
                <div>
                  <h4 className="font-semibold mb-2">Business Description</h4>
                  <p className="text-sm text-muted-foreground">{application.businessDescription}</p>
                </div>
              )}
              {'trustPurpose' in application && application.trustPurpose && (
                <div>
                  <h4 className="font-semibold mb-2">Trust Purpose</h4>
                  <p className="text-sm text-muted-foreground">{application.trustPurpose}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {taskId ? 'No application data available for this task.' : 'No application data available for this instance.'}
            </p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="attachments" className="mt-4">
        <div className="space-y-3">
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No attachments available.</p>
          ) : (
            attachments.map(attachment => {
              const fileSizeKB = (attachment.fileSize / 1024).toFixed(2);
              const uploadUser = ((usersData as unknown) as User[]).find(u => u.id === attachment.uploadedBy);
              return (
                <div key={attachment.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon name="file-line" className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{attachment.fileName}</span>
                      </div>
                      {attachment.description && (
                        <p className="text-xs text-muted-foreground mb-1">{attachment.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{fileSizeKB} KB</span>
                        <span>{attachment.fileType}</span>
                        {uploadUser && <span>Uploaded by {uploadUser.name}</span>}
                        <span>{format(new Date(attachment.uploadedAt), 'PPp')}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Icon name="download-line" className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="knowledge-base" className="mt-4">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Knowledge base content will be displayed here. This section can contain helpful documentation, 
            guidelines, and reference materials related to this task type.
          </p>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Related Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Icon name="file-text-line" className="w-4 h-4" />
                <span>Registration Guidelines</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="file-text-line" className="w-4 h-4" />
                <span>Compliance Requirements</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="file-text-line" className="w-4 h-4" />
                <span>Processing Procedures</span>
              </li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

