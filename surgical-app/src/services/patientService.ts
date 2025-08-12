import { supabase } from '@/lib/supabase';
import { Patient } from '@/types/patient';

export async function createPatient(patient: Omit<Patient, 'created_at'>) {
  const { data, error } = await supabase.from('patients').insert([patient]).select();

  if (error) throw error;
  return data;
}

export async function updatePatientStatus(patientId: string, status: Patient['status']) {
  const { data, error } = await supabase
    .from('patients')
    .update({ status })
    .eq('id', patientId)
    .select();

  if (error) throw error;
  return data;
}

export async function getPatients() {
  const { data, error } = await supabase.from('patients').select('*');

  if (error) throw error;
  return data;
}
