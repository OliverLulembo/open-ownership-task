"use client"

import { parseReferences } from '@/lib/references';
import { cn } from '@/lib/utils';

interface ReferenceLinkProps {
  text: string;
  onTaskClick?: (taskId: string) => void;
  onInstanceClick?: (instanceId: string) => void;
  className?: string;
}

export function ReferenceLink({ text, onTaskClick, onInstanceClick, className }: ReferenceLinkProps) {
  const references = parseReferences(text);
  
  if (references.length === 0) {
    return <span className={className}>{text}</span>;
  }

  let lastIndex = 0;
  const parts: React.ReactNode[] = [];

  references.forEach((ref, index) => {
    const refIndex = text.indexOf(ref.original, lastIndex);
    
    // Add text before reference
    if (refIndex > lastIndex) {
      parts.push(text.slice(lastIndex, refIndex));
    }

    // Add clickable reference
    parts.push(
      <button
        key={index}
        onClick={() => {
          if (ref.type === 'task' && onTaskClick) {
            onTaskClick(ref.id);
          } else if (ref.type === 'instance' && onInstanceClick) {
            onInstanceClick(ref.id);
          }
        }}
        className={cn(
          "text-blue-600 hover:underline font-medium",
          className
        )}
      >
        {ref.original}
      </button>
    );

    lastIndex = refIndex + ref.original.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}

