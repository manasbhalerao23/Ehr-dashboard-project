import axios, { AxiosInstance } from 'axios'
import { prisma } from './db'

export class ModMedClient {
  private client: AxiosInstance
  private accessToken?: string

  constructor(accessToken?: string) {
    this.accessToken = accessToken
    this.client = axios.create({
      baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.MODMED_API_URL 
        : process.env.MODMED_SANDBOX_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    })

    // Request interceptor for debugging
    this.client.interceptors.request.use((config) => {
      console.log(`ModMed API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('ModMed API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  // Authentication
  async authenticate(clientId?: string, clientSecret?: string): Promise<any> {
    try {
      const response = await this.client.post('/oauth/token', {
        grant_type: 'client_credentials',
        client_id: clientId || process.env.MODMED_CLIENT_ID,
        client_secret: clientSecret || process.env.MODMED_CLIENT_SECRET
      })
      
      this.accessToken = response.data.access_token
      this.client.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`
      
      return response.data
    } catch (error) {
      console.error('ModMed Authentication Error:', error)
      throw error
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/health')
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  // Patient Management
  async getPatients(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<any> {
    const response = await this.client.get('/patients', { params })
    return response.data
  }

  async getPatient(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}`)
    return response.data
  }

  async createPatient(patientData: any): Promise<any> {
    const response = await this.client.post('/patients', patientData)
    return response.data
  }

  async updatePatient(patientId: string, patientData: any): Promise<any> {
    const response = await this.client.put(`/patients/${patientId}`, patientData)
    return response.data
  }

  async deletePatient(patientId: string): Promise<any> {
    const response = await this.client.delete(`/patients/${patientId}`)
    return response.data
  }

  // Appointment Management
  async getAppointments(params?: {
    patientId?: string
    providerId?: string
    date?: string
    status?: string
  }): Promise<any> {
    const response = await this.client.get('/appointments', { params })
    return response.data
  }

  async createAppointment(appointmentData: any): Promise<any> {
    const response = await this.client.post('/appointments', appointmentData)
    return response.data
  }

  async updateAppointment(appointmentId: string, appointmentData: any): Promise<any> {
    const response = await this.client.put(`/appointments/${appointmentId}`, appointmentData)
    return response.data
  }

  async cancelAppointment(appointmentId: string): Promise<any> {
    const response = await this.client.patch(`/appointments/${appointmentId}/cancel`)
    return response.data
  }

  // Clinical Operations
  async getClinicalNotes(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}/clinical-notes`)
    return response.data
  }

  async createClinicalNote(patientId: string, noteData: any): Promise<any> {
    const response = await this.client.post(`/patients/${patientId}/clinical-notes`, noteData)
    return response.data
  }

  async getVitalSigns(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}/vital-signs`)
    return response.data
  }

  async recordVitalSigns(patientId: string, vitalsData: any): Promise<any> {
    const response = await this.client.post(`/patients/${patientId}/vital-signs`, vitalsData)
    return response.data
  }

  async getLabResults(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}/lab-results`)
    return response.data
  }

  async getMedications(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}/medications`)
    return response.data
  }

  async updateMedications(patientId: string, medications: any[]): Promise<any> {
    const response = await this.client.put(`/patients/${patientId}/medications`, { medications })
    return response.data
  }

  // Billing Operations
  async getInsuranceEligibility(patientId: string): Promise<any> {
    const response = await this.client.get(`/patients/${patientId}/insurance/eligibility`)
    return response.data
  }

  async getBillingClaims(params?: {
    patientId?: string
    status?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<any> {
    const response = await this.client.get('/billing/claims', { params })
    return response.data
  }

  async submitClaim(claimData: any): Promise<any> {
    const response = await this.client.post('/billing/claims', claimData)
    return response.data
  }

  async getPaymentHistory(patientId?: string): Promise<any> {
    const params = patientId ? { patientId } : {}
    const response = await this.client.get('/billing/payments', { params })
    return response.data
  }
}

// Helper function to get authenticated client
export async function getModMedClient(userId?: string): Promise<ModMedClient> {
  if (userId) {
    const tokenRecord = await prisma.modmedToken.findUnique({
      where: { userId }
    })
    
    if (tokenRecord && tokenRecord.expiresAt > new Date()) {
      return new ModMedClient(tokenRecord.accessToken)
    }
  }
  
  // Create new client and authenticate
  const client = new ModMedClient()
  try {
    await client.authenticate()
    return client
  } catch (error) {
    console.error('Failed to authenticate with ModMed:', error)
    throw new Error('Unable to connect to ModMed API')
  }
}