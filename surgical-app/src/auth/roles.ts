// Roles used across the app
export type Role = 'guest' | 'surgical' | 'admin';

// Minimal user shape for our hard-coded list (guest doesn't log in)
export type AuthUser = {
  email: string;
  password: string; // plain text only for MVP demo
  name: string;
  role: Exclude<Role, 'guest'>; // 'admin' | 'surgical'
};

// Hard-coded demo users (MVP only; replace later with real auth)
export const USERS: AuthUser[] = [
  { email: 'admin1@demo.com', password: 'demo123', name: 'Admin One', role: 'admin' },
  { email: 'scrub1@demo.com', password: 'demo123', name: 'Scrub Nurse', role: 'surgical' },
];

// Helper to find a matching user by credentials (used in Login step)
export function findUserByCredentials(email: string, password: string): AuthUser | null {
  const e = email.trim().toLowerCase();
  const u = USERS.find((u) => u.email.toLowerCase() === e && u.password === password);
  return u ?? null;
}

// Session shape we’ll store in localStorage (set in step 2)
export type Session = { role: Role; email?: string; name?: string } | null;

// Guests don’t log in; if no session is present, treat as 'guest'
export const DEFAULT_GUEST_SESSION: Session = { role: 'guest' };
