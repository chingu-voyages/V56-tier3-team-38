export type PatientStatus =
  | 'Checked In'
  | 'Pre-Procedure'
  | 'In-Progress'
  | 'Closing'
  | 'Recovery'
  | 'Complete'
  | 'Dismissal';

export interface Patient {
  id: string; // patient number
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  email: string;
  status: PatientStatus;
  created_at?: string;
}
