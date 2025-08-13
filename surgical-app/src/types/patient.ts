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
// Code that validates "only move to previous or next" depends on this array.
export const STATUS_ORDER: PatientStatus[] = [
  'Checked In',
  'Pre-Procedure',
  'In-Progress',
  'Closing',
  'Recovery',
  'Complete',
  'Dismissal',
];

// Fields collected from the Patient Information form.
// These are the patient's personal/contact details and do NOT include id or status.
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

// Full patient record as stored in the database.
// - id is the 6-character patient number (letters/numbers only).
// - status is the patient's current status.
// - created_at is added by the DB.
export interface Patient extends PatientBase {
  id: string; // 6-char patient number
  status: PatientStatus;
  created_at?: string;
}

// Shape of data accepted when creating a patient via the form.
// - We intentionally exclude id and status; those are assigned by the service layer.
export type PatientCreate = PatientBase;

// Shape of data accepted when updating patient info (not status).
// - All fields are optional because updates may be partial.
// - id and status must NOT be updated here.
export type PatientUpdate = Partial<PatientBase>;
