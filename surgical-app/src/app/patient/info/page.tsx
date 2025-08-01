'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


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

    async function handleAddPatient(evt: React.FormEvent) {
        evt.preventDefault();
        console.log('formData=', formData)
        if (!formData.firstName || !formData.lastName) {
            setError('add');
            return;
        }
        try {
            //example request. add more logic when backend created
            const result = await axios.post('www.example.com', { data: { ...formData } });
            const resp = result.data;
        } catch (err) {
            console.log('err:', err);
        }
    }

    async function handleUpdatePatient(evt: React.FormEvent) {
        evt.preventDefault();
        console.log('formData=', formData)
        if (!formData.patientNum) {
            setError('update');
            return;
        }
        try {
            //example request. add more logic when backend created
            const result = await axios.patch('www.example.com', { data: { ...formData } });
            const resp = result.data;
        } catch (err) {
            console.log('err:', err);
        }
    }

    return (
        <div>
            <h2>Patient Information Screen</h2>

            <form>
                <label htmlFor="patientNum">Patient No:</label>
                <input
                    type='text'
                    name='patientNum'
                    id='patientNum'
                    value={formData.patientNum}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">First Name</label>
                <input
                    type='text'
                    name='firstName'
                    id='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">Last Name</label>
                <input
                    type='text'
                    name='lastName'
                    id='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">Street</label>
                <input
                    type='text'
                    name='street'
                    id='street'
                    value={formData.street}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">City</label>
                <input
                    type='text'
                    name='city'
                    id='city'
                    value={formData.city}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">State</label>
                <input
                    type='text'
                    name='state'
                    id='state'
                    value={formData.state}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">Country</label>
                <input
                    type='text'
                    name='country'
                    id='country'
                    value={formData.country}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">Telephone</label>
                <input
                    type='text'
                    name='telephone'
                    id='telephone'
                    value={formData.telephone}
                    onChange={handleChange}
                />
                <label htmlFor="firstName">Contact Email</label>
                <input
                    type='text'
                    name='contactEmail'
                    id='contactEmail'
                    value={formData.contactEmail}
                    onChange={handleChange}
                />

                <button type='button' onClick={handleCancel}>Cancel</button>
                <button type='submit' onClick={handleAddPatient}>Add</button>
                <button type='submit' onClick={handleUpdatePatient}>Update</button>
            </form>

            {error === 'add' ? <p>First Name and Last Name are required</p> : null}
            {error === 'update' ? <p>Patient Number is required</p> : null}
        </div>
    )
};
