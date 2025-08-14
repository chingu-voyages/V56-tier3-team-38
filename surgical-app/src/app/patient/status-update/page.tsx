'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import type { Patient, PatientStatus } from '@/types/patient';
import {
  STATUS_LABELS,
  getAllowedStatuses,
  isValidPatientNumber,
  normalizePatientNumber,
} from '@/types/patient';
import { getPatientById, updatePatientStatus } from '@/services/patientService';

export default function StatusUpdate() {
  // Basic form state
  const [patientNumber, setPatientNumber] = useState('');
  const [patient, setPatient] = useState<Patient | null>(null);

  // Status dropdown state
  const [allowed, setAllowed] = useState<PatientStatus[]>([]);
  const [newStatus, setNewStatus] = useState<PatientStatus | ''>('');

  // UI state
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Search by patient number
  const handleSearch = async () => {
    setError('');
    setSuccess('');
    setPatient(null);
    setAllowed([]);
    setNewStatus('');

    const raw = patientNumber;
    if (!isValidPatientNumber(raw)) {
      setError('Patient number must be 6 letters/numbers (no spaces).');
      return;
    }

    try {
      setIsSearching(true);
      const p = await getPatientById(raw);
      if (!p) {
        setError('No patient found for that number.');
        return;
      }
      setPatient(p);
      setAllowed(getAllowedStatuses(p.status));
      // Normalize the input box for clarity
      setPatientNumber(normalizePatientNumber(raw));
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Failed to search. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Update status (only to previous or next)
  const handleUpdate = async () => {
    if (!patient || !newStatus || newStatus === patient.status) return;

    setError('');
    setSuccess('');

    try {
      setIsUpdating(true);
      await updatePatientStatus(patient.id, newStatus);
      // Update local state so the UI reflects the change immediately
      const updated: Patient = { ...patient, status: newStatus };
      setPatient(updated);
      setAllowed(getAllowedStatuses(updated.status));
      setNewStatus('');
      setSuccess('Status updated successfully.');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Failed to search. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    // Just clear selection and messages (keep the loaded patient)
    setNewStatus('');
    setError('');
    setSuccess('');
  };

  const disableUpdate =
    !patient || !newStatus || (patient && newStatus === patient.status) || isUpdating;

  return (
    <section>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="font-bold text-2xl text-center mb-8 sm:text-3xl">Update Patient Status</h1>

        {/* Search row */}
        <div className="flex items-center gap-2 mb-4">
          <label htmlFor="patient-number" className="whitespace-nowrap">
            Patient Number:
          </label>
          <Input
            id="patient-number"
            className="max-w-xs"
            value={patientNumber}
            onChange={(e) => setPatientNumber(e.target.value)}
            placeholder="e.g. A1B2C3"
            maxLength={6}
          />
          <Button variant="secondary" onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Messages */}
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {success && <p className="text-sm text-green-600 mb-2">{success}</p>}

        {/* Patient info table */}
        {patient && (
          <>
            <div>
              <label className="whitespace-nowrap font-medium">Patient Info:</label>
              <Table className="mt-4">
                <TableBody>
                  <TableRow>
                    <TableHead className="w-48">First Name</TableHead>
                    <TableCell>{patient.first_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Last Name</TableHead>
                    <TableCell>{patient.last_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Street Address</TableHead>
                    <TableCell>{patient.street_address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableCell>{patient.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableCell>{patient.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableCell>{patient.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Telephone</TableHead>
                    <TableCell>{patient.telephone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableCell>{patient.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Current status (read-only) */}
            <div className="flex items-center gap-2 mt-6">
              <label htmlFor="current-status" className="whitespace-nowrap">
                Current Status:
              </label>
              <Input id="current-status" readOnly className="max-w-xs" value={patient.status} />
            </div>

            {/* New status (only allowed: previous or next) */}
            <div className="flex items-center gap-2 mt-3">
              <label htmlFor="new-status" className="whitespace-nowrap">
                New Status:
              </label>
              <div className="w-full max-w-xs">
                <Select
                  value={newStatus || undefined}
                  onValueChange={(v) => setNewStatus(v as PatientStatus)}
                >
                  <SelectTrigger id="new-status" className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowed.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleCancel} disabled={isUpdating}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={disableUpdate}>
                {isUpdating ? 'Updating...' : 'Add / Update'}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
