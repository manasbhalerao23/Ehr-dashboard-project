'use client';

import { useState } from 'react';
import { useModMedPatients, useCreatePatient } from '@/hooks/use-modmed';
import PatientTable from '@/components/dashboard/PatientTable';
import PatientForm from '@/components/forms/PatientForm';

export default function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: patients, isLoading, error } = useModMedPatients();
  const createPatient = useCreatePatient();

  if (isLoading) return <div>Loading patients...</div>;
  if (error) return <div>Error loading patients</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-healthcare-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Patient
        </button>
      </div>

      <PatientTable patients={patients} />

      {showForm && (
        <PatientForm
          onSubmit={(data) => {
            createPatient.mutate(data);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}