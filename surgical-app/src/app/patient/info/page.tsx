'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"


export default function PatientInfo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        patientNum: '',
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        country: '',
        telephone: '',
        contactEmail: ''
    });
    const [error, setError] = useState('');


    function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        let { name, value } = evt.target;
        setFormData((formData) => ({ ...formData, [name]: value }));
        setError('');
    }

    function handleCancel(): void {
        router.push('/');
    }

    // Handle add patient info request. 
    // Function will be updated when backend is ready.
    async function handleAddPatient(evt: React.FormEvent) {
        evt.preventDefault();
        const newFormData = { ...formData, patientNum: '' }
        console.log('newFormData=', newFormData)
        if (!newFormData.firstName || !newFormData.lastName) {
            setError('add');
            return;
        }
    }

    // Handle update patient info request. 
    // Function will be updated when backend is ready.
    async function handleUpdatePatient(evt: React.FormEvent) {
        evt.preventDefault();
        console.log('formData=', formData)
        if (!formData.patientNum) {
            setError('update');
            return;
        }
    }

    return (
        <div className='flex flex-col justify-center items-center p-6'>
            <h2 className='text-2xl text-center font-semibold md:text-3xl my-9'>Add/Update Patient Information</h2>

            <form className="flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="patientNum" className="w-full sm:w-32 text-left font-bold py-1">Patient No:</label>
                    <input
                        type='text'
                        name='patientNum'
                        id='patientNum'
                        value={formData.patientNum}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="firstName" className="w-full sm:w-32 text-left font-bold">First Name:</label>
                    <input
                        type='text'
                        name='firstName'
                        id='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="lastName" className="w-full sm:w-32 text-left font-bold">Last Name:</label>
                    <input
                        type='text'
                        name='lastName'
                        id='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full sm:flex-1 border-2 border-gray-400 rounded-xs px-3 mb-3"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <label htmlFor="street" className="w-full sm:w-32 text-left font-bold">Street:</label>
                    <input
                        type='text'
                        name='street'
                        id='street'
                        value={formData.street}
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
                    <label htmlFor="contactEmail" className="w-full sm:w-32 text-left font-bold">Contact Email:</label>
                    <input
                        type='text'
                        name='contactEmail'
                        id='contactEmail'
                        value={formData.contactEmail}
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