"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { ProcessList } from '@/components/overseer/ProcessList';

export default function OverseerDashboard() {
  const router = useRouter();
  const { user, hasRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || !hasRole('overseer'))) {
      router.push('/');
    }
  }, [user, hasRole, isLoading, router]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 overflow-hidden">
        <ProcessList />
      </div>
    </div>
  );
}

