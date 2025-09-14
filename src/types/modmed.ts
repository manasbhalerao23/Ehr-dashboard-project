export interface ModMedPatient {
  id: string
  externalId?: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  insurance?: {
    provider?: string
    memberId?: string
    groupNumber?: string
  }
  allergies?: string[]
  medications?: string[]
  status: 'active' | 'inactive'
}

export interface ModMedAppointment {
  id: string
  patientId: string
  providerId: string
  dateTime: string
  duration: number
  type: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  reason?: string
  notes?: string
}

export interface ModMedProvider {
  id: string
  firstName: string
  lastName: string
  specialty?: string
  email?: string
  phone?: string
}

export interface ModMedVitalSigns {
  id: string
  patientId: string
  recordedAt: string
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  heartRate?: number
  temperature?: number
  weight?: number
  height?: number
  respiratoryRate?: number
  oxygenSaturation?: number
}

export interface ModMedClinicalNote {
  id: string
  patientId: string
  providerId: string
  title: string
  content: string
  type: string
  createdAt: string
}

export interface ModMedBillingClaim {
  id: string
  patientId: string
  amount: number
  status: 'pending' | 'submitted' | 'approved' | 'denied' | 'paid'
  serviceDate: string
  description: string
  insuranceClaimId?: string
}