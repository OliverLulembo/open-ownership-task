"use client"

import { useState, useEffect } from 'react';
import { WorkflowTask, WorkflowInstance } from '@/types/workflow';
import { getInstances, getTasksByInstance, getProcess } from '@/lib/dataService';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TaskDrawer } from '@/components/shared/TaskDrawer';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function ProcessTimeline() {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const instances = getInstances();
    const allTasks: WorkflowTask[] = [];
    
    instances.forEach(instance => {
      const instanceTasks = getTasksByInstance(instance.id);
      allTasks.push(...instanceTasks);
    });

    // Sort by createdAt
    allTasks.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    setTasks(allTasks);
  };

  const handleTaskClick = (task: WorkflowTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const now = new Date();
  const pastTasks = tasks.filter(t => 
    t.completedAt ? new Date(t.completedAt) < now : 
    t.dueBy ? new Date(t.dueBy) < now : false
  );
  const currentTasks = tasks.filter(t => 
    !t.completedAt && (!t.dueBy || new Date(t.dueBy) >= now)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Process Timeline</h2>
        <p className="text-sm text-muted-foreground">
          View all tasks chronologically across all processes
        </p>
      </div>

      <div className="space-y-8">
        {pastTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              Past Tasks
            </h3>
            <div className="space-y-3">
              {pastTasks.map(task => {
                const instance = getInstances().find(i => i.id === task.instanceId);
                const process = instance ? getProcess(instance.processId) : null;
                
                return (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <StatusBadge status={task.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Process: {process?.name || 'Unknown'}</div>
                        <div>Instance: {task.instanceId}</div>
                        <div>
                          Created: {format(new Date(task.createdAt), 'PPp')}
                        </div>
                        {task.completedAt && (
                          <div>
                            Completed: {format(new Date(task.completedAt), 'PPp')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {currentTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Tasks</h3>
            <div className="space-y-3">
              {currentTasks.map(task => {
                const instance = getInstances().find(i => i.id === task.instanceId);
                const process = instance ? getProcess(instance.processId) : null;
                
                return (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{task.title}</CardTitle>
                        <StatusBadge status={task.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Process: {process?.name || 'Unknown'}</div>
                        <div>Instance: {task.instanceId}</div>
                        <div>
                          Created: {format(new Date(task.createdAt), 'PPp')}
                        </div>
                        {task.dueBy && (
                          <div>
                            Due: {format(new Date(task.dueBy), 'PPp')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No tasks found
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          showActions={false}
        />
      )}
    </div>
  );
}

