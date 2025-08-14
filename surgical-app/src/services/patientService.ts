// Client-side service: call Supabase directly from the browser.
// IMPORTANT: Make sure RLS/Policies enforce who can read/update.
// Adjust import path to your Supabase client.
import { supabase } from '@/lib/supabase';
import type { Patient, PatientStatus } from '@/types/patient';
import { getAllowedStatuses, normalizePatientNumber } from '@/types/patient';

const TABLE = 'patients';

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
