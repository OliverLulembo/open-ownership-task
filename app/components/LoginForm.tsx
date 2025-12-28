"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(email);
    if (user) {
      if (user.role === 'executor') {
        router.push('/executor');
      } else {
        router.push('/overseer');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the work interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="executor@example.com"
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="text-xs text-muted-foreground mt-4">
            <p>Demo accounts:</p>
            <ul className="list-disc list-inside mt-1">
              <li>executor@example.com (Executor)</li>
              <li>overseer@example.com (Overseer)</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

