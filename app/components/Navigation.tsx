"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const executorLinks = [
    { href: '/executor/kanban', label: 'Dashboard' },
  ];

  const overseerLinks = [
    { href: '/overseer', label: 'Dashboard' },
  ];

  const links = user.role === 'executor' ? executorLinks : overseerLinks;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href={user.role === 'executor' ? '/executor' : '/overseer'} className="font-bold">
              Work Interface
            </Link>
            <div className="flex gap-4">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm hover:underline ${
                    pathname === link.href ? 'font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

