import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// Patients
export function useModMedPatients(params?: {
  page?: number
  limit?: number
  search?: string
}) {
  return useQuery({
    queryKey: ['modmed', 'patients', params],
    queryFn: async () => {
      const response = await axios.get('/api/modmed/patients', { params })
      return response.data
    }
  })
}

export function useModMedPatient(patientId: string) {
  return useQuery({
    queryKey: ['modmed', 'patient', patientId],
    queryFn: async () => {
      const response = await axios.get(`/api/modmed/patients/${patientId}`)
      return response.data
    },
    enabled: !!patientId
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (patientData: any) => {
      const response = await axios.post('/api/modmed/patients', patientData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modmed', 'patients'] })
    }
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.put(`/api/modmed/patients/${id}`, data)
      return response.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['modmed', 'patients'] })
      queryClient.invalidateQueries({ queryKey: ['modmed', 'patient', variables.id] })
    }
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (patientId: string) => {
      const response = await axios.delete(`/api/modmed/patients/${patientId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modmed', 'patients'] })
    }
  })
}

// Appointments
export function useModMedAppointments(params?: {
  patientId?: string
  providerId?: string
  date?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['modmed', 'appointments', params],
    queryFn: async () => {
      const response = await axios.get('/api/modmed/appointments', { params })
      return response.data
    }
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await axios.post('/api/modmed/appointments', appointmentData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modmed', 'appointments'] })
    }
  })
}

// Connection Test
export function useTestConnection() {
  return useMutation({
    mutationFn: async (credentials: {
      clientId: string
      clientSecret: string
      useSandbox: boolean
    }) => {
      const response = await axios.post('/api/modmed/test-connection', credentials)
      return response.data
    }
  })
}