"use client"

import { useState, useEffect } from 'react';
import { WorkflowTask, UserStatus } from '@/types/workflow';
import { getTasksByUser } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskDrawer } from '@/components/shared/TaskDrawer';

export function KanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = () => {
    if (user) {
      const userTasks = getTasksByUser(user.id);
      setTasks(userTasks);
    }
  };

  const handleTaskClick = (task: WorkflowTask) => {
    task.userStatus = 'Opened';
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleTaskUpdate = () => {
    loadTasks();
  };

  const columns: { title: string; userStatus: UserStatus; icon: string }[] = [
    { title: 'In Tray', userStatus: 'New', icon: 'inbox-line' },
    { title: 'In Progress', userStatus: 'Opened', icon: 'loader-4-line' },
    { title: 'Stashed', userStatus: 'Stashed', icon: 'archive-line' },
    { title: 'Out Tray', userStatus: 'Completed', icon: 'check-double-line' },
  ];

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map(({ title, userStatus, icon }) => {
          const columnTasks = tasks.filter(t => t.userStatus === userStatus);
          return (
            <KanbanColumn
              key={userStatus}
              title={title}
              userStatus={userStatus}
              tasks={columnTasks}
              onTaskClick={handleTaskClick}
              icon={icon}
            />
          );
        })}
      </div>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onTaskUpdate={handleTaskUpdate}
          showActions={true}
        />
      )}
    </div>
  );
}

