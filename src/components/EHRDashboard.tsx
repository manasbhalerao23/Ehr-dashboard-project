import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, FileText, Users, CreditCard, Settings, Bell, User, ChevronDown, Filter, Download, Upload, Heart, Activity, Pill, TestTube, Shield, Clock, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Patient {
  id: string;
  modmedId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  allergies?: string[];
  medications?: string[];
  insurance?: {
    provider: string;
    id: string;
  };
  lastVisit?: string;
  status: 'active' | 'inactive';
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  dateTime: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
}

// Mock Data
const mockPatients: Patient[] = [
  {
    id: '1',
    modmedId: 'MM-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701'
    },
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    insurance: {
      provider: 'Blue Cross',
      id: 'BC123456789'
    },
    lastVisit: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    modmedId: 'MM-002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1990-07-22',
    status: 'active',
    lastVisit: '2024-01-10'
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    providerId: 'P1',
    providerName: 'Dr. Sarah Wilson',
    dateTime: '2024-01-20T10:00:00',
    duration: 30,
    type: 'Routine Checkup',
    status: 'confirmed',
    reason: 'Annual physical examination'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Smith',
    providerId: 'P2',
    providerName: 'Dr. Michael Johnson',
    dateTime: '2024-01-21T14:30:00',
    duration: 45,
    type: 'Consultation',
    status: 'scheduled',
    reason: 'Follow-up on medication'
  }
];

// Components
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'clinical', name: 'Clinical', icon: FileText },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">EHR Dashboard</h2>
            <p className="text-sm text-gray-500">ModMed Integration</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Dr. Admin</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title, subtitle }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Bell className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  </div>
);

const StatsCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const PatientTable = ({ patients, onEditPatient, onDeletePatient }) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 inline mr-2" />
            Filter
          </button>
          <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                  <div className="text-sm text-gray-500">ID: {patient.modmedId}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{patient.email}</div>
                <div className="text-sm text-gray-500">{patient.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.dateOfBirth}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {patient.lastVisit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  patient.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEditPatient(patient)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDeletePatient(patient.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PatientForm = ({ patient, onSave, onCancel }) => {
  const [formData, setFormData] = useState(patient || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.address?.state || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={formData.address?.zip || ''}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: { ...formData.address, zip: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {patient ? 'Update Patient' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AppointmentScheduler = ({ appointments }) => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 inline mr-2" />
          Schedule Appointment
        </button>
      </div>
    </div>
    
    <div className="p-6">
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(appointment.dateTime).toLocaleDateString()} at{' '}
                  {new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600">
                  Provider: {appointment.providerName} | Type: {appointment.type}
                </p>
                <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VitalSignsChart = () => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">Vital Signs Tracking</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">120/80</p>
          <p className="text-sm text-gray-600">Blood Pressure</p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">72</p>
          <p className="text-sm text-gray-600">Heart Rate</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <TestTube className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">98.6°F</p>
          <p className="text-sm text-gray-600">Temperature</p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">98%</p>
          <p className="text-sm text-gray-600">Oxygen Sat</p>
        </div>
      </div>
    </div>
  </div>
);

const BillingOverview = () => (
  <div className="bg-white rounded-lg shadow-sm border">
    <div className="p-6 border-b">
      <h3 className="text-lg font-semibold text-gray-900">Billing & Insurance</h3>
    </div>
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Outstanding Claims</p>
            <p className="text-sm text-gray-600">12 claims pending review</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-600">$4,250</p>
            <p className="text-sm text-gray-600">Total Amount</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Processed Claims</p>
            <p className="text-sm text-gray-600">45 claims this month</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">$18,750</p>
            <p className="text-sm text-gray-600">Total Received</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Denied Claims</p>
            <p className="text-sm text-gray-600">3 claims need attention</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">$890</p>
            <p className="text-sm text-gray-600">Total Denied</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsPanel = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">ModMed API Configuration</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Base URL
          </label>
          <input
            type="url"
            defaultValue="https://api.modmed.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client ID
          </label>
          <input
            type="text"
            placeholder="Enter your ModMed Client ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Secret
          </label>
          <input
            type="password"
            placeholder="Enter your ModMed Client Secret"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="sandbox" className="rounded" />
          <label htmlFor="sandbox" className="text-sm text-gray-700">
            Use Sandbox Environment
          </label>
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          Test Connection
        </button>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">API Connection</span>
          <span className="flex items-center text-red-600">
            <XCircle className="w-4 h-4 mr-1" />
            Not Connected
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Database Status</span>
          <span className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Connected
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Last Sync</span>
          <span className="text-gray-600">Never</span>
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const EHRDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState(mockPatients);
  const [appointments] = useState(mockAppointments);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowPatientForm(true);
  };

  const handleDeletePatient = (patientId) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  const handleSavePatient = (patientData) => {
    if (editingPatient) {
      setPatients(patients.map(p => 
        p.id === editingPatient.id 
          ? { ...patientData, id: editingPatient.id, modmedId: editingPatient.modmedId }
          : p
      ));
    } else {
      const newPatient = {
        ...patientData,
        id: Date.now().toString(),
        modmedId: `MM-${String(patients.length + 1).padStart(3, '0')}`,
        status: 'active'
      };
      setPatients([...patients, newPatient]);
    }
    setShowPatientForm(false);
    setEditingPatient(null);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <Header 
        title="Dashboard Overview" 
        subtitle="Welcome to your EHR Integration Dashboard"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value={patients.length.toString()}
          change="+12%"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Today's Appointments"
          value="8"
          change="+5%"
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Pending Claims"
          value="12"
          change="-8%"
          icon={CreditCard}
          color="yellow"
        />
        <StatsCard
          title="Active Alerts"
          value="3"
          change="+2"
          icon={AlertCircle}
          color="red"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentScheduler appointments={appointments.slice(0, 3)} />
        <VitalSignsChart />
      </div>
      
      <BillingOverview />
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <Header 
        title="Patient Management" 
        subtitle="Manage patient records and information"
      />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4 inline mr-2" />
            Import Patients
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-2" />
            Export Data
          </button>
        </div>
        <button 
          onClick={() => {
            setEditingPatient(null);
            setShowPatientForm(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add New Patient
        </button>
      </div>
      
      <PatientTable 
        patients={patients}
        onEditPatient={handleEditPatient}
        onDeletePatient={handleDeletePatient}
      />
      
      {showPatientForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setShowPatientForm(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <Header 
        title="Appointment Management" 
        subtitle="Schedule and manage patient appointments"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentScheduler appointments={appointments} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                Schedule New Appointment
              </button>
              <button className="w-full text-left px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                Check Provider Availability
              </button>
              <button className="w-full text-left px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">
                View Appointment Conflicts
              </button>
              <button className="w-full text-left px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                Generate Schedule Report
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Today's Schedule</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">9:00 AM - John Doe</span>
                <span className="text-green-600">Confirmed</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">10:30 AM - Jane Smith</span>
                <span className="text-blue-600">Scheduled</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">2:00 PM - Available</span>
                <span className="text-gray-400">Open Slot</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClinical = () => (
    <div className="space-y-6">
      <Header 
        title="Clinical Operations" 
        subtitle="Manage clinical notes, vital signs, and medical records"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VitalSignsChart />
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Clinical Notes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-gray-900">Annual Physical - John Doe</p>
                <p className="text-sm text-gray-600">Dr. Sarah Wilson • Jan 15, 2024</p>
                <p className="text-sm text-gray-700 mt-2">
                  Patient presents for routine annual physical. No acute complaints...
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium text-gray-900">Follow-up Visit - Jane Smith</p>
                <p className="text-sm text-gray-600">Dr. Michael Johnson • Jan 14, 2024</p>
                <p className="text-sm text-gray-700 mt-2">
                  Patient returning for medication follow-up. BP well controlled...
                </p>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Add New Clinical Note
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Lab Results</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Complete Blood Count</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Basic Metabolic Panel</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Lipid Panel</span>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Review</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Pill className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Lisinopril 10mg</p>
                  <p className="text-xs text-gray-500">Once daily</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Pill className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Metformin 500mg</p>
                  <p className="text-xs text-gray-500">Twice daily</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Update Medications
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Allergies & Conditions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Allergies</h4>
                <div className="space-y-1">
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Penicillin
                  </span>
                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded ml-2">
                    Peanuts
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Conditions</h4>
                <div className="space-y-1">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Hypertension
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">
                    Diabetes Type 2
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <Header 
        title="Billing & Administrative" 
        subtitle="Manage billing, insurance, and financial operations"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Monthly Revenue"
          value="$45,280"
          change="+8.5%"
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Outstanding Claims"
          value="$12,450"
          change="-5.2%"
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Collection Rate"
          value="94.2%"
          change="+1.8%"
          icon={CheckCircle}
          color="blue"
        />
      </div>
      
      <BillingOverview />
      
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Jan 15, 2024</td>
                <td className="px-6 py-4 text-sm text-gray-900">John Doe</td>
                <td className="px-6 py-4 text-sm text-gray-900">Annual Physical</td>
                <td className="px-6 py-4 text-sm text-gray-900">$250.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Paid
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Jan 14, 2024</td>
                <td className="px-6 py-4 text-sm text-gray-900">Jane Smith</td>
                <td className="px-6 py-4 text-sm text-gray-900">Follow-up Visit</td>
                <td className="px-6 py-4 text-sm text-gray-900">$150.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'patients':
        return renderPatients();
      case 'appointments':
        return renderAppointments();
      case 'clinical':
        return renderClinical();
      case 'billing':
        return renderBilling();
      case 'settings':
        return <SettingsPanel />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default EHRDashboard