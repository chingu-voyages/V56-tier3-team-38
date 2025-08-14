'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { createPatient } from "@/services/patientService";
import { updatePatient } from "@/services/patientService";


export default function PatientInfo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        street_address: '',
        city: '',
        state: '',
        country: '',
        telephone: '',
        email: ''
    });
    const [error, setError] = useState('');

    // Update formData state and show changes in input fields
    function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        let { name, value } = evt.target;
        setFormData((formData) => ({ ...formData, [name]: value }));
        setError('');
    }

    function handleCancel(): void {
        router.push('/');
    }

    // Handles add patient info form submission
    async function handleAddPatient(evt: React.FormEvent) {
        evt.preventDefault();
        if (!formData.first_name || !formData.last_name) {
            setError('add');
            return;
        }

        try {
            const resp = await createPatient(formData);
            console.log('resp=', resp)
            setFormData({ ...resp })
        } catch (err) {
            console.log('err:', err);
        }
    }

    // Handles update patient info form submission
    async function handleUpdatePatient(evt: React.FormEvent) {
        evt.preventDefault();
        if (!formData.id) {
            setError('update');
            return;
        }

        try {
            const resp = await updatePatient(formData.id, formData);
            console.log('resp=', resp)
        } catch (err) {
            console.log('err:', err);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center p-6'>
            <h2 className='text-2xl text-center font-semibold md:text-3xl my-9'>Add/Update Patient Information</h2>

            <form className="flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="id" className="w-full sm:w-32 text-left font-bold py-1">Patient No:</label>
                    <input
                        type='text'
                        name='id'
                        id='id'
                        value={formData.id}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="first_name" className="w-full sm:w-32 text-left font-bold">First Name:</label>
                    <input
                        type='text'
                        name='first_name'
                        id='first_name'
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="last_name" className="w-full sm:w-32 text-left font-bold">Last Name:</label>
                    <input
                        type='text'
                        name='last_name'
                        id='last_name'
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="street_address" className="w-full sm:w-32 text-left font-bold">Street:</label>
                    <input
                        type='text'
                        name='street_address'
                        id='street_address'
                        value={formData.street_address}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="city" className="w-full sm:w-32 text-left font-bold">City:</label>
                    <input
                        type='text'
                        name='city'
                        id='city'
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="state" className="w-full sm:w-32 text-left font-bold">State:</label>
                    <input
                        type='text'
                        name='state'
                        id='state'
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="country" className="w-full sm:w-32 text-left font-bold">Country:</label>
                    <input
                        type='text'
                        name='country'
                        id='country'
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="telephone" className="w-full sm:w-32 text-left font-bold">Telephone:</label>
                    <input
                        type='text'
                        name='telephone'
                        id='telephone'
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="email" className="w-full sm:w-32 text-left font-bold">Contact Email:</label>
                    <input
                        type='text'
                        name='email'
                        id='email'
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-row justify-center my-8 space-x-4">
                    <Button className="bg-sky-500 hover:bg-sky-700" type='submit' onClick={handleAddPatient}>Add</Button>
                    <Button className="bg-sky-500 hover:bg-sky-700" type='submit' onClick={handleUpdatePatient}>Update</Button>
                    <Button className="bg-sky-500 hover:bg-sky-700" type='button' onClick={handleCancel}>Cancel</Button>
                </div>
            </form>

            {error === 'add' ? <p className="text-red-500 font-bold">First Name and Last Name are required</p> : null}
            {error === 'update' ? <p className="text-red-500 font-bold">Patient Number is required</p> : null}
        </div >
    )
};