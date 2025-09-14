import axios, { AxiosInstance } from 'axios'
import { prisma } from './db'

export class ModMedClient {
  private client: AxiosInstance
  private apiKey: string
  private firmPrefix: string
  private username: string
  private password: string

  constructor() {
    this.apiKey = process.env.MODMED_API_KEY!
    this.firmPrefix = process.env.MODMED_FIRM_PREFIX!
    this.username = process.env.MODMED_USERNAME!
    this.password = process.env.MODMED_PASSWORD!
    
    this.client = axios.create({
      baseURL: `${process.env.MODMED_API_URL}/${this.firmPrefix}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-API-Key': this.apiKey
      },
      timeout: 30000
    })

    // Request interceptor for debugging
    this.client.interceptors.request.use((config) => {
      console.log(`🔵 ModMed API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ ModMed API Response: ${response.status}`)
        return response
      },
      (error) => {
        if (error.response?.status === 403) {
          console.error('🚨 403 Forbidden - Connect to US VPN first!')
        }
        console.error('❌ ModMed API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  // Authentication with username/password
  async authenticate(clientId: unknown, clientSecret: unknown): Promise<unknown> {
    try {
      console.log('🔐 Authenticating with ModMed...')
      const response = await this.client.post('/oauth2/token', {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username: this.username,
        password: this.password
      })
      
      if (response.data.access_token) {
        this.client.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`
        console.log('✅ ModMed Authentication successful')
      }
      
      return response.data
    } catch (error) {
      console.error('❌ ModMed Authentication failed:', error)
      // Continue without auth for basic operations
      return null
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 Testing ModMed connection...')
      const response = await this.client.get('/Patient?_count=1')
      console.log('✅ ModMed connection successful')
      return response.status === 200
    } catch (error) {
      console.error('❌ ModMed connection test failed:', error)
      return false
    }
  }

  // FHIR Patient endpoints
  async getPatients(params?: {
    _count?: number
    _offset?: number
    name?: string
    identifier?: string
  }): Promise<unknown> {
    try {
      console.log('📋 Fetching patients from ModMed...')
      const response = await this.client.get<FhirBundle<PatientData>>('/Patient', { 
        params: {
          _count: 20,
          _format: 'json',
          ...params
        }
      })
      console.log(`✅ Found ${response.data.entry?.length || 0} patients`)
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch patients:', error)
      throw error
    }
  }

  async getPatient(patientId: string): Promise<unknown> {
    try {
      const response = await this.client.get(`/Patient/${patientId}`)
      return response.data
    } catch (error) {
      console.error(`❌ Failed to fetch patient ${patientId}:`, error)
      throw error
    }
  }

  async createPatient(patientData: PatientInput): Promise<unknown> {
    try {
      // Convert to FHIR format
      const fhirPatient = this.convertToFHIRPatient(patientData)
      const response = await this.client.post('/Patient', fhirPatient)
      console.log('✅ Patient created successfully')
      return response.data
    } catch (error) {
      console.error('❌ Failed to create patient:', error)
      throw error
    }
  }

  async updatePatient(patientId: string, patientData: PatientInput): Promise<unknown> {
    try {
      const fhirPatient = this.convertToFHIRPatient(patientData)
      const response = await this.client.put(`/Patient/${patientId}`, fhirPatient)
      console.log('✅ Patient updated successfully')
      return response.data
    } catch (error) {
      console.error('❌ Failed to update patient:', error)
      throw error
    }
  }

  // FHIR Appointment endpoints
  async getAppointments(params?: {
    patient?: string
    practitioner?: string
    date?: string
    status?: string
  }): Promise<unknown> {
    try {
      const response = await this.client.get('/Appointment', { 
        params: {
          _count: 50,
          _format: 'json',
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch appointments:', error)
      throw error
    }
  }

  async createAppointment(appointmentData: AppointmentInput): Promise<unknown> {
    try {
      const fhirAppointment = this.convertToFHIRAppointment(appointmentData)
      const response = await this.client.post('/Appointment', fhirAppointment)
      return response.data
    } catch (error) {
      console.error('❌ Failed to create appointment:', error)
      throw error
    }
  }

  // FHIR Observation endpoints (Vital Signs)
  async getObservations(patientId: string, category?: string): Promise<unknown> {
    try {
      const params: Record<string, string | number> = {
        patient: patientId,
        _count: 50,
        _format: 'json'
      }
      
      if (category) {
        params.category = category
      }
      
      const response = await this.client.get('/Observation', { params })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch observations:', error)
      throw error
    }
  }

  async createObservation(observationData: ObservationInput): Promise<unknown> {
    try {
      const fhirObservation = this.convertToFHIRObservation(observationData)
      const response = await this.client.post('/Observation', fhirObservation)
      return response.data
    } catch (error) {
      console.error('❌ Failed to create observation:', error)
      throw error
    }
  }

  // FHIR Condition endpoints
  async getConditions(patientId: string): Promise<unknown> {
    try {
      const response = await this.client.get('/Condition', { 
        params: { 
          patient: patientId,
          _format: 'json'
        }
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch conditions:', error)
      throw error
    }
  }

  // FHIR MedicationRequest endpoints
  async getMedications(patientId: string): Promise<unknown> {
    try {
      const response = await this.client.get('/MedicationRequest', { 
        params: { 
          patient: patientId,
          _format: 'json'
        }
      })
      return response.data
    } catch (error) {
      console.error('❌ Failed to fetch medications:', error)
      throw error
    }
  }

  // Helper methods to convert data to FHIR format
  private convertToFHIRPatient(patientData: PatientInput): unknown {
    return {
      resourceType: "Patient",
      name: [{
        use: "official",
        family: patientData.lastName,
        given: [patientData.firstName]
      }],
      telecom: [
        ...(patientData.phone ? [{
          system: "phone",
          value: patientData.phone,
          use: "home"
        }] : []),
        ...(patientData.email ? [{
          system: "email",
          value: patientData.email,
          use: "home"
        }] : [])
      ],
      gender: patientData.gender || "unknown",
      birthDate: patientData.dateOfBirth,
      address: patientData.address ? [{
        use: "home",
        line: [patientData.address.street],
        city: patientData.address.city,
        state: patientData.address.state,
        postalCode: patientData.address.zip
      }] : [],
      active: patientData.status === 'active'
    }
  }

  private convertToFHIRAppointment(appointmentData: AppointmentInput): unknown {
    return {
      resourceType: "Appointment",
      status: appointmentData.status || "proposed",
      serviceType: [{
        text: appointmentData.type
      }],
      reasonReference: [{
        display: appointmentData.reason
      }],
      start: appointmentData.dateTime,
      end: new Date(new Date(appointmentData.dateTime).getTime() + (appointmentData.duration || 30) * 60000).toISOString(),
      participant: [
        {
          actor: {
            reference: `Patient/${appointmentData.patientId}`
          },
          required: "required",
          status: "accepted"
        }
      ]
    }
  }

  private convertToFHIRObservation(observationData: ObservationInput): unknown {
    return {
      resourceType: "Observation",
      status: "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/observation-category",
          code: "vital-signs",
          display: "Vital Signs"
        }]
      }],
      subject: {
        reference: `Patient/${observationData.patientId}`
      },
      effectiveDateTime: observationData.recordedAt || new Date().toISOString(),
      component: [
        ...(observationData.bloodPressureSystolic && observationData.bloodPressureDiastolic ? [{
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "85354-9",
              display: "Blood pressure panel"
            }]
          },
          valueQuantity: {
            value: `${observationData.bloodPressureSystolic}/${observationData.bloodPressureDiastolic}`,
            unit: "mmHg"
          }
        }] : []),
        ...(observationData.heartRate ? [{
          code: {
            coding: [{
              system: "http://loinc.org",
              code: "8867-4",
              display: "Heart rate"
            }]
          },
          valueQuantity: {
            value: observationData.heartRate,
            unit: "/min"
          }
        }] : [])
      ]
    }
  }
}

// Helper function to get authenticated client
export async function getModMedClient(id: string): Promise<ModMedClient> {
  const client = new ModMedClient()
  try {
    await client.authenticate(
      process.env.MODMED_CLIENT_ID!,
      process.env.MODMED_CLIENT_SECRET!
    )
    return client
  } catch (error) {
    console.error('Failed to authenticate with ModMed:', error)
    return client // Return client anyway for basic operations
  }
}

//Types to avoid type errors
interface PatientData {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  gender?: "male" | "female" | "other" | "unknown"
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  status?: "active" | "inactive"
}
interface FhirBundle<T> {
  resourceType: "Bundle"
  type: string
  total?: number
  entry?: {
    fullUrl?: string
    resource: T
  }[]
}

interface PatientInput {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  gender?: "male" | "female" | "other" | "unknown"
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  status?: "active" | "inactive"
}
interface AppointmentInput {
  patientId: string
  type?: string
  reason?: string
  dateTime: string
  duration?: number
  status?: string
}

interface ObservationInput {
  patientId: string
  recordedAt?: string
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
}