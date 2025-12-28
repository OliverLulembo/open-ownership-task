"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { KanbanBoard } from '@/components/executor/KanbanBoard';
import { TodoListView } from '@/components/executor/TodoListView';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { Icon } from '@/components/ui/Icon';

export default function KanbanPage() {
  const router = useRouter();
  const { user, hasRole, isLoading } = useAuth();
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !hasRole('executor'))) {
      router.push('/');
    }
  }, [user, hasRole, isLoading, router]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">Your Desk</h1>
          
          <span id='view-switcher' className="flex items-center gap-2 mt-4">
            <Button variant={activeView === 'kanban' ? 'active' : 'outline'} size="sm" onClick={() => setActiveView('kanban')}>Your Trays</Button>
            <Button variant={activeView === 'list' ? 'active' : 'outline'} size="sm" onClick={() => setActiveView('list')}>Todays To Do List</Button>
            <Button variant="outline" size="sm" onClick={() => setChatOpen(true)} className="ml-auto">
              <Icon name="message-3-line" className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </span>
          </div>
          <p className="text-xs text-muted-foreground">
            You have 4 trays on your desk, your "in tray" has all incoming tasks, your "on desk" tray has all tasks that you're working on right now, your "stashed" tray has all tasks that you've opened, but stashed, and your "out tray" has all tasks that are completed.
          </p>
        </div>
        <div className="h-[calc(100vh-200px)]">
          {activeView === 'kanban' ? (
            <KanbanBoard />
          ) : (
            <TodoListView />
          )}
        </div>
      </div>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
            <SheetDescription>
              Communicate with your team. Reference tasks using TASK-123 or instances using INST-456
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 h-[calc(100vh-120px)]">
            <ChatPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

