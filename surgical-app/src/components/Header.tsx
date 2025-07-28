'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState('');

  // These will eventually come from the auth system(Supabase)
  const isAdmin = true; // Admins can access all screens
  const isTeamMember = true; // Surgical team members can access everything except Patient Info

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
            Surgery Tracker
          </Link>

          {/* Responsive Nav */}
          <nav
            className={cn(
              'flex flex-col gap-2 md:flex-row md:gap-8 md:justify-center md:items-center',
              open ? 'absolute top-10 left-2 bg-gray-200 p-4 rounded' : 'hidden'
            )}
          >
            <Link href="/">Home</Link>
            <hr className="md:hidden border-gray-300" />
            {isAdmin && <Link href="/patient-info">Patient Information</Link>}
            <hr className="md:hidden border-gray-300" />
            {(isAdmin || isTeamMember) && <Link href="/status-update">Patient Status Update</Link>}
            <hr className="md:hidden border-gray-300" />
            <Link href="/status">Patient Status</Link>
          </nav>

          {/* Right: Today's Date */}
          <div className="text-gray-600 text-sm">{today}</div>
        </div>
      </div>
    </header>
  );
}
