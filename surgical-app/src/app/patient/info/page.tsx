'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createPatient, updatePatient } from '@/services/patientService';
import { toast } from 'sonner';

// FormData 型
interface PatientFormData {
  id: string;
  first_name: string;
  last_name: string;
  street_address: string;
  city: string;
  state: string;
  country: string;
  telephone: string;
  email: string;
}

const INITIAL_FORM: PatientFormData = {
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

// form field
interface FormField {
  key: keyof PatientFormData;
  label: string;
  type?: 'text' | 'email' | 'tel';
  pattern?: string;
  title?: string;
}

// form
const FORM_FIELDS: FormField[] = [
  { key: 'id', label: 'Patient No:' },
  { key: 'first_name', label: 'First Name:' },
  { key: 'last_name', label: 'Last Name:' },
  { key: 'street_address', label: 'Street:' },
  { key: 'city', label: 'City:' },
  { key: 'state', label: 'State:' },
  { key: 'country', label: 'Country:' },
  {
    key: 'telephone',
    label: 'Telephone:',
    type: 'tel',
    pattern: '[0-9]*',
    title: 'Please only enter numbers',
  },
  { key: 'email', label: 'Contact Email:', type: 'email' },
];

export default function PatientInfo() {
  const router = useRouter();
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM);

  // type safe handleChange
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (evt: React.MouseEvent<HTMLButtonElement>, mode: 'add' | 'update') => {
    const form = evt.currentTarget.form as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    evt.preventDefault();

    try {
      if (mode === 'add') {
        if (!formData.first_name || !formData.last_name) {
          toast.error('First Name and Last Name are required');
          return;
        }
        if (formData.id) {
          toast.error('Patient Number is not required when adding patient information');
          return;
        }

        const resp = await createPatient(formData);
        toast.success(`${resp.first_name} ${resp.last_name} was added. Patient Number: ${resp.id}`);
        setFormData((prev) => ({ ...prev, id: resp.id }));
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
      console.error('err:', err);
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
        {FORM_FIELDS.map(({ key, label, type = 'text', pattern, title }) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label htmlFor={key} className="w-full sm:w-32 text-left font-bold md:mb-3">
              {label}
            </label>
            <input
              type={type}
              name={key}
              id={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
              {...(pattern && { pattern })}
              {...(title && { title })}
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
