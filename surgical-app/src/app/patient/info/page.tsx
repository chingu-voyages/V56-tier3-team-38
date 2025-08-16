'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createPatient } from '@/services/patientService';
import { updatePatient } from '@/services/patientService';
import { toast } from 'sonner';

const INITIAL_FORM = {
  id: '',
  first_name: '',
  last_name: '',
  street_address: '',
  city: '',
  state: '',
  country: '',
  telephone: '',
  email: '',
};

export default function PatientInfo() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  // Update formData state and show changes in input fields
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target;
    setFormData((formData) => ({ ...formData, [name]: value }));
  }

  function handleCancel(): void {
    router.push('/');
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>, mode: 'add' | 'update') => {
    const form = e.currentTarget.form as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    e.preventDefault();
    try {
      if (mode === 'add') {
        if (!formData.first_name || !formData.last_name) {
          console.log('🚀 ~ handleSubmit ~ g:');
          toast.error('First Name and Last Name are required');
          return;
        }
        if (formData.id) {
          toast.error('Patient Number is not required when adding patient information');
          return;
        }
        const resp = await createPatient(formData);
        toast.success(`${resp.first_name} ${resp.last_name} was added. Patient Number: ${resp.id}`);
        setFormData((formData) => ({ ...formData, id: resp.id }));
      }
      if (mode === 'update') {
        if (!formData.id) {
          toast.error('Patient Number is required when updating patient information');
          return;
        }
        await updatePatient(formData.id, formData);
        toast.success('Patient information was successfully updated');
      }
    } catch (err: unknown) {
      const error = err as { message?: string; details?: string };
      if (error.details === 'The result contains 0 rows') {
        toast.error('Patient Number is incorrect. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6">
      <h2 className="text-2xl text-center font-semibold md:text-3xl my-9">
        Add/Update Patient Information
      </h2>
      <form className="flex flex-col justify-center">
        {Object.entries({
          id: 'Patient No:',
          first_name: 'First Name:',
          last_name: 'Last Name:',
          street_address: 'Street:',
          city: 'City:',
          state: 'State:',
          country: 'Country:',
          telephone: 'Telephone:',
          email: 'Contact Email:',
        }).map(([key, label]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor={key} className="w-full sm:w-32 text-left font-bold md:mb-3">
              {label}
            </label>
            <input
              type={key === 'email' ? 'email' : key === 'telephone' ? 'tel' : 'text'}
              name={key}
              id={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
              {...(key === 'telephone' && {
                pattern: '[0-9]*',
                title: 'Please only enter numbers',
              })}
            />
          </div>
        ))}

        <div className="flex flex-row justify-center my-8 space-x-4">
          <Button
            className="bg-sky-500 hover:bg-sky-700"
            type="submit"
            onClick={(e) => handleSubmit(e, 'add')}
          >
            Add
          </Button>
          <Button
            className="bg-sky-500 hover:bg-sky-700"
            type="submit"
            onClick={(e) => handleSubmit(e, 'update')}
          >
            Update
          </Button>
          <Button className="bg-sky-500 hover:bg-sky-700" type="button" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
