'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/auth';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = evt.target;
    setFormData((data) => ({ ...data, [name]: value }));
  }

  // Handles login form submission using our MVP hard-coded auth.
  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    try {
      await login(formData.username.trim(), formData.password);
      router.push('/patient/status-update');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed. Please try again.';
      window.alert(msg);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center p6">
      <form onSubmit={handleSubmit} className="flex flex-col justify-center">
        <h2 className="text-2xl text-center font-semibold md:text-3xl my-9">Login Form</h2>

        <label htmlFor="username" className="text-left font-bold py-1">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="sm:w-70 border-2 border-gray-400 rounded-xs px-3 mb-4 py-1"
        />

        <label htmlFor="password" className="text-left font-bold py-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="sm:w-70 border-2 border-gray-400 rounded-xs px-3 mb-8 py-1"
        />

        <Button type="submit" className="mb-30">
          Submit
        </Button>
      </form>
    </div>
  );
}
