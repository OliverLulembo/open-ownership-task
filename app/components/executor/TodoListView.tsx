"use client"

import { useState, useEffect } from 'react';
import { WorkflowTask } from '@/types/workflow';
import { getTasksByUser } from '@/lib/dataService';
import { sortTasksByPriority } from '@/lib/taskUtils';
import { getTimeLeft } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { TodoListItem } from '@/components/shared/TodoListItem';
import { TaskDrawer } from '@/components/shared/TaskDrawer';

export function TodoListView() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<WorkflowTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [user]);

  const loadTasks = () => {
    if (user) {
      const userTasks = getTasksByUser(user.id);
      
      // Calculate timeLeft for all tasks
      userTasks.forEach(task => getTimeLeft(task));
      
      // Separate completed and incomplete tasks
      const incomplete = userTasks.filter(task => task.status !== 'Completed');
      const completed = userTasks.filter(task => task.status === 'Completed');
      
      // Sort incomplete tasks by priority (Overdue → Urgent → Important → Can do Later → Not important)
      // Then by timeLeft ascending within same priority
      const sortedIncomplete = sortTasksByPriority(incomplete);
      
      // Sort completed tasks (most recent first)
      const sortedCompleted = completed.sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return bTime - aTime;
      });
      
      setTasks(sortedIncomplete);
      setCompletedTasks(sortedCompleted);
    }
  };

  const handleTaskClick = (task: WorkflowTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const handleTaskUpdate = () => {
    loadTasks();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">To-Do List</h2>
        <p className="text-sm text-muted-foreground">
          Tasks ordered by priority and time remaining
        </p>
      </div>

      {/* Incomplete Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 && completedTasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            No tasks assigned
          </div>
        ) : (
          <>
            {tasks.length > 0 && (
              <>
                {tasks.map(task => (
                  <TodoListItem
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                ))}
              </>
            )}
            
            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TodoListItem
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
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

