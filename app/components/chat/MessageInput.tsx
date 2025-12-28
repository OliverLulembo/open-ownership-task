"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addMessage } from '@/lib/dataService';
import { useAuth } from '@/contexts/AuthContext';

interface MessageInputProps {
  onMessageSent?: () => void;
}

export function MessageInput({ onMessageSent }: MessageInputProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || !user) return;

    addMessage(user.id, message);
    setMessage('');
    onMessageSent?.();
  };

  return (
    <div className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Type a message... (Use TASK-123 or INST-456 for references)"
        className="flex-1"
      />
      <Button onClick={handleSend} disabled={!message.trim()}>
        Send
      </Button>
    </div>
  );
}

