"use client"

import { User } from '@/types/workflow';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user?: User;
  userId?: string;
  name?: string;
  className?: string;
}

export function UserAvatar({ user, userId, name, className }: UserAvatarProps) {
  const displayName = user?.name || name || 'Unknown';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-sm font-medium",
        className
      )}
      title={displayName}
    >
      {initials}
    </div>
  );
}

