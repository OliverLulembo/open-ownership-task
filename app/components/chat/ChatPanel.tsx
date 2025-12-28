"use client"

import { useState, useEffect } from 'react';
import { Message } from '@/types/workflow';
import { getMessages } from '@/lib/dataService';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TaskDrawer } from '@/components/shared/TaskDrawer';
import { getTask } from '@/lib/dataService';
import { WorkflowTask } from '@/types/workflow';

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const allMessages = getMessages();
    setMessages(allMessages);
  };

  const handleTaskClick = (taskId: string) => {
    // Convert TASK-1 format to task-1 format
    const normalizedId = `task-${taskId}`;
    const task = getTask(normalizedId);
    if (task) {
      setSelectedTask(task);
      setDrawerOpen(true);
    }
  };

  const handleInstanceClick = (instanceId: string) => {
    // For now, just show a message or could navigate to instance details
    console.log('Instance clicked:', instanceId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Chat</h2>
        <p className="text-sm text-muted-foreground">
          Communicate with your team. Reference tasks using TASK-123 or instances using INST-456
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList
          messages={messages}
          onTaskClick={handleTaskClick}
          onInstanceClick={handleInstanceClick}
        />
      </div>

      <MessageInput onMessageSent={loadMessages} />

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

