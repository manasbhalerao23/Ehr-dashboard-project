import axios, { AxiosInstance } from 'axios';

export class ModMedClient {
  private client: AxiosInstance;
  
  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: process.env.MODMED_API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    });
  }

  // Authentication
  async authenticate(clientId: string, clientSecret: string) {
    const response = await this.client.post('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret
    });
    return response.data;
  }

  // Patients
  async getPatients(params?: any) {
    const response = await this.client.get('/patients', { params });
    return response.data;
  }

  async getPatient(patientId: string) {
    const response = await this.client.get(`/patients/${patientId}`);
    return response.data;
  }

  async createPatient(patientData: any) {
    const response = await this.client.post('/patients', patientData);
    return response.data;
  }

  async updatePatient(patientId: string, patientData: any) {
    const response = await this.client.put(`/patients/${patientId}`, patientData);
    return response.data;
  }

  // Appointments
  async getAppointments(params?: any) {
    const response = await this.client.get('/appointments', { params });
    return response.data;
  }

  async createAppointment(appointmentData: any) {
    const response = await this.client.post('/appointments', appointmentData);
    return response.data;
  }

  // Add more methods for clinical operations, billing, etc.
}