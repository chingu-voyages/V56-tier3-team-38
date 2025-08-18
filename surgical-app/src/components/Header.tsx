'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/auth/auth'; // use session + logout

export default function Header() {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState('');

  // Read role from our simple auth context (guest by default)
  const { session, logout } = useAuth();
  const role = session?.role ?? 'guest';

  // Role booleans matching the spec
  const isAdmin = role === 'admin';
  const isTeamMember = role === 'surgical';
  const isStaff = isAdmin || isTeamMember; // staff can see Status Update; only admin sees Patient Info

  useEffect(() => {
    // Avoid hydration mismatch with locale-sensitive formatting
    const formatted = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    setToday(formatted);
  }, []);

  return (
    <header className="shadow">
      <div className="container mx-auto p-4">
        {/* Top Menu Bar */}
        <div className="relative flex items-center justify-between">
          {/* Hamburger (mobile only) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </Button>

          {/* App Name */}
          <Link href="/" className="font-semibold text-lg">
            Surgery Status Board
          </Link>

          {/* Responsive Nav (kept same structure; only role logic changed) */}
          <nav
            className={cn(
              'flex-col gap-2 hidden md:flex-row md:gap-8 md:justify-center md:items-center md:flex',
              open && 'flex absolute top-10 left-2 bg-gray-200 p-4 rounded'
            )}
          >
            <Link href="/">Home</Link>
            <hr className="md:hidden border-gray-300" />
            <Link href="/patient">Patient Status</Link>
            <hr className="md:hidden border-gray-300" />

            {/* Staff-only: Status Update (admins + surgical team) */}
            {isStaff && <Link href="/patient/status-update">Patient Status Update</Link>}

            <hr className="md:hidden border-gray-300" />

            {/* Admin-only: Patient Information */}
            {isAdmin && <Link href="/patient/info">Patient Information</Link>}

            <hr className="md:hidden border-gray-300" />

            {/* Auth action: show Login for guests, Logout for staff/admin */}
            {role === 'guest' ? (
              <Link href="/login">Login</Link>
            ) : (
              <button
                type="button"
                className="text-left md:text-inherit underline md:no-underline"
                onClick={logout}
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Right: Today's Date (unchanged) */}
          <div className="text-gray-600 text-sm">{today}</div>
        </div>
      </div>
    </header>
  );
}
