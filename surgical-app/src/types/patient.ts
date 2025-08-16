// All possible patient statuses in the exact order they should progress.
export type PatientStatus =
  | 'Checked In'
  | 'Pre-Procedure'
  | 'In-Progress'
  | 'Closing'
  | 'Recovery'
  | 'Complete'
  | 'Dismissal';

// Defines the allowed and expected progression order of statuses.
export const STATUS_ORDER: PatientStatus[] = [
  'Checked In',
  'Pre-Procedure',
  'In-Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

// For UI labels (keep in one place for easy changes later).
export const STATUS_LABELS: Record<PatientStatus, string> = {
  'Checked In': 'Checked In',
  'Pre-Procedure': 'Pre-Procedure',
  'In-Progress': 'In-Progress',
  Closing: 'Closing',
  Recovery: 'Recovery',
  Complete: 'Complete',
  Dismissal: 'Dismissal',
};

// Assign unique colors to each status.
export const STATUS_COLORS: Record<PatientStatus, string> = {
  'Checked In': '#1E90FF', // Dodger Blue
  'Pre-Procedure': '#FFA500', // Orange
  'In-Progress': '#FF4500', // OrangeRed
  Closing: '#8A2BE2', // BlueViolet
  Recovery: '#32CD32', // LimeGreen
  Complete: '#2E8B57', // SeaGreen
  Dismissal: '#696969', // DimGray
};

// Personal/contact fields collected on the Patient Information form.
export interface PatientBase {
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  email: string;
}

// Full row shape in DB.
export interface Patient extends PatientBase {
  id: string; // 6-character patient number (A–Z, a–z, 0–9)
  status: PatientStatus; // current status
  created_at?: string; // optional if your table adds it
}

// Shape for creating a patient from the form (id/status are assigned elsewhere).
export type PatientCreate = PatientBase;

// Shape for updating patient info (not status).
export type PatientUpdate = Partial<PatientBase>;

/* ---------------- Helpers ---------------- */

// Get previous and next statuses for a given status.
export function getNeighbors(status: PatientStatus) {
  const i = STATUS_ORDER.indexOf(status);
  return {
    prev: i > 0 ? STATUS_ORDER[i - 1] : undefined,
    next: i >= 0 && i < STATUS_ORDER.length - 1 ? STATUS_ORDER[i + 1] : undefined,
  };
}

// Allowed choices according to the spec: only previous or next.
export function getAllowedStatuses(current: PatientStatus) {
  const { prev, next } = getNeighbors(current);
  return [prev, next].filter(Boolean) as PatientStatus[];
}

// Validate patient number (exactly 6 alphanumeric characters).
export function isValidPatientNumber(s: string) {
  return /^[A-Za-z0-9]{6}$/.test((s || '').trim());
}

// Normalize patient number to uppercase (helps consistency in DB queries).
export function normalizePatientNumber(s: string) {
  return (s || '').trim().toUpperCase();
}
