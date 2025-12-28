"use client"

import { Message } from '@/types/workflow';
import { ReferenceLink } from './ReferenceLink';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { format } from 'date-fns';
import usersData from '@/data/users.json';

interface MessageListProps {
  messages: Message[];
  onTaskClick?: (taskId: string) => void;
  onInstanceClick?: (instanceId: string) => void;
}

export function MessageList({ messages, onTaskClick, onInstanceClick }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map(message => {
        const user = usersData.find(u => u.id === message.userId);
        
        return (
          <div key={message.id} className="flex gap-3">
            <UserAvatar user={user} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{user?.name || 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), 'PPp')}
                </span>
              </div>
              <div className="text-sm">
                <ReferenceLink
                  text={message.content}
                  onTaskClick={onTaskClick}
                  onInstanceClick={onInstanceClick}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

