// src/services/patientService.ts
import { supabase } from '@/lib/supabase';
import {
  Patient,
  PatientCreate,
  PatientStatus,
  PatientUpdate,
  getAllowedStatuses,
  normalizePatientNumber,
} from '@/types/patient';

const TABLE = 'patients';

// -------------------- Utilities --------------------

// Characters allowed in a generated patient id (patient number).
// The spec requires "exactly six characters containing any combination of letters or numbers".
const ALNUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Generates a random 6-character alphanumeric id.
// This satisfies the format requirement but not uniqueness or PII(=Personally Identifiable Information) checks by itself.
function randomId6() {
  let s = '';
  for (let i = 0; i < 6; i++) s += ALNUM[Math.floor(Math.random() * ALNUM.length)];
  return s;
}

// Checks whether a given patient id already exists in the database.
async function isPatientIdTaken(id: string) {
  const { data, error } = await supabase.from('patients').select('id').eq('id', id).limit(1);
  if (error) throw error;
  return (data?.length || 0) > 0;
}

// Builds a set of "PII tokens" (2~6 char substrings) from fields like name, address,
// and the local part of email. We use these tokens to ensure the generated id does not
// include any part of a patient's personal information.
function buildPiiTokens(input: PatientCreate) {
  const toks: string[] = [];
  const push = (s?: string) => {
    const v = (s ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let len = 2; len <= Math.min(6, v.length); len++) {
      for (let i = 0; i + len <= v.length; i++) toks.push(v.slice(i, i + len));
    }
  };
  push(input.first_name);
  push(input.last_name);
  push(input.street_address);
  push(input.city);
  push(input.state);
  push(input.country);
  push(input.telephone);
  push((input.email || '').split('@')[0]);
  return new Set(toks);
}

// Generates a patient id that is:
// 1) correct format (6 alphanumeric chars),
// 2) not containing any substring of personally identifiable information, and
// 3) unique in the database.
// Retries up to N times to find a safe and unique id.
async function generateSafePatientId(input: PatientCreate) {
  const pii = buildPiiTokens(input);
  for (let i = 0; i < 50; i++) {
    const id = randomId6();
    const low = id.toLowerCase();

    // Reject ids that contain any 2+ char PII token.
    let containsPII = false;
    for (const t of pii) {
      if (t.length >= 2 && low.includes(t)) {
        containsPII = true;
        break;
      }
    }
    if (containsPII) continue;

    // Reject ids already taken in the DB.
    if (await isPatientIdTaken(id)) continue;

    return id;
  }
  throw new Error('Failed to generate a safe unique patient number');
}

// -------------------- CRUD --------------------

// Creates a new patient record from form input.
// - Generates a safe 6-char id that avoids PII and collisions.
// - Sets the initial status to "Checked In" per the spec.
// - Returns the full inserted record.
export async function createPatient(input: PatientCreate) {
  const id = await generateSafePatientId(input);
  const status: PatientStatus = 'Checked In';

  const payload = { ...input, id, status };
  const { data, error } = await supabase.from('patients').insert([payload]).select().single();

  if (error) throw error;
  return data as Patient;
}

// Updates personal/contact info for an existing patient.
// - Use this to edit fields like address, phone, email, etc.
// - id and status are intentionally NOT updatable here.
export async function updatePatient(patientId: string, updates: PatientUpdate) {
  const safe: Record<string, unknown> = { ...updates };
  // Using `any` here avoids TypeScript complaints about removing keys
  /* eslint-disable @typescript-eslint/no-explicit-any */
  delete (safe as any).id;
  delete (safe as any).status;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const { data, error } = await supabase
    .from('patients')
    .update(safe)
    .eq('id', patientId)
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}

// Update status with strict validation (only previous or next allowed).
export async function updatePatientStatus(id: string, nextStatus: PatientStatus): Promise<void> {
  const patient = await getPatientById(id);
  if (!patient) throw new Error('No patient found for that number.');

  const allowed = getAllowedStatuses(patient.status);
  if (!allowed.includes(nextStatus)) {
    // Enforce the spec: can only move to the previous or next status.
    throw new Error('Only the previous or the next status is allowed.');
  }

  const { error } = await supabase.from(TABLE).update({ status: nextStatus }).eq('id', patient.id); // use normalized id returned from DB

  if (error) throw new Error(error.message);
}

// Fetch a patient by patient number (id).
export async function getPatientById(id: string): Promise<Patient | null> {
  const normalized = normalizePatientNumber(id);
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      'id, first_name, last_name, street_address, city, state, country, telephone, email, status'
    )
    .eq('id', normalized)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Patient) ?? null;
}

// Returns the minimal dataset for the public status board.
// - Excludes "Dismissal" because those patients should be removed from the display.
// - Orders by creation time so the board cycles in a stable order.
export async function getActivePatientsForDisplay() {
  const { data, error } = await supabase
    .from('patients')
    .select('id, status')
    .neq('status', 'Dismissal')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Pick<Patient, 'id' | 'status'>[];
}

// OPTIONAL: Returns full patient rows ordered by creation time (newest first).
// - Useful for admin dashboards, debugging, or when showing a full list before filtering/search.
// - Not required for the public status display MVP.
export async function getPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Patient[];
}

// OPTIONAL: Searches patients by last name for admin/status-update screens.
// - Uses case-insensitive match and sorts by last name.
export async function searchPatientsByLastName(lastName: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .ilike('last_name', `%${lastName}%`)
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data as Patient[];
}
