import axios, { AxiosInstance } from 'axios'

export class AthenaClient {
  private client: AxiosInstance
  private accessToken?: string
  private practiceId: string = '195900' // Default practice ID

  constructor(accessToken?: string) {
    this.accessToken = accessToken
    this.client = axios.create({
      baseURL: process.env.NODE_ENV === 'production' 
        ? process.env.ATHENA_API_URL 
        : process.env.ATHENA_SANDBOX_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      timeout: 30000
    })

    // Request interceptor
    this.client.interceptors.request.use((config) => {
      console.log(`Athena API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    })

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          console.error('403 Forbidden - Make sure you are connected to US VPN!')
        }
        console.error('Athena API Error:', error.response?.data || error.message)
        throw error
      }
    )
  }

  // Authentication
  async authenticate(clientId: string, clientSecret: string): Promise<unknown> {
    try {
      const response = await this.client.post('/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      })
      
      this.accessToken = response.data.access_token
      this.client.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`
      
      return response.data
    } catch (error) {
      console.error('Athena Authentication Error:', error)
      throw error
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get(`/v1/${this.practiceId}/patients`)
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  // Patient Management
  async getPatients(params?: {
    limit?: number
    offset?: number
    firstname?: string
    lastname?: string
  }): Promise<unknown> {
    const response = await this.client.get(`/v1/${this.practiceId}/patients`, { params })
    return response.data
  }

  async getPatient(patientId: string): Promise<unknown> {
    const response = await this.client.get(`/v1/${this.practiceId}/patients/${patientId}`)
    return response.data
  }

  async createPatient(patientData: unknown): Promise<unknown> {
    const response = await this.client.post(`/v1/${this.practiceId}/patients`, patientData)
    return response.data
  }

  async updatePatient(patientId: string, patientData: unknown): Promise<unknown> {
    const response = await this.client.put(`/v1/${this.practiceId}/patients/${patientId}`, patientData)
    return response.data
  }

  // Appointment Management
  async getAppointments(params?: {
    departmentid?: string
    startdate?: string
    enddate?: string
    patientid?: string
  }): Promise<unknown> {
    const response = await this.client.get(`/v1/${this.practiceId}/appointments/open`, { params })
    return response.data
  }

  async bookAppointment(appointmentData: unknown): Promise<unknown> {
    const response = await this.client.post(`/v1/${this.practiceId}/appointments/{appointmentid}/book`, appointmentData)
    return response.data
  }

  // Clinical Data
  async getVitals(patientId: string, departmentId: string): Promise<unknown> {
    const response = await this.client.get(`/v1/${this.practiceId}/patients/${patientId}/vitals`, {
      params: { departmentid: departmentId }
    })
    return response.data
  }

  async recordVitals(patientId: string, vitalsData: unknown): Promise<unknown> {
    const response = await this.client.post(`/v1/${this.practiceId}/patients/${patientId}/vitals`, vitalsData)
    return response.data
  }

  // Insurance and Eligibility
  async checkEligibility(patientId: string, params: unknown): Promise<unknown> {
    const response = await this.client.get(`/v1/${this.practiceId}/patients/${patientId}/insurances/eligibility`, {
      params
    })
    return response.data
  }
}

export async function getAthenaClient(): Promise<AthenaClient> {
  const client = new AthenaClient()
  try {
    // You'll need to implement OAuth2 flow or get tokens from portal
    // For now, return client for testing
    return client
  } catch (error) {
    console.error('Failed to authenticate with Athena:', error)
    throw new Error('Unable to connect to Athena API')
  }
}