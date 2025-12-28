"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { ProcessTimeline } from '@/components/overseer/ProcessTimeline';

export default function TimelinePage() {
  const router = useRouter();
  const { user, hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !hasRole('overseer'))) {
      router.push('/');
    }
  }, [user, hasRole, isLoading, router]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ProcessTimeline />
      </div>
    </div>
  );
}

