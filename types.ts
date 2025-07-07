
export enum UserRole {
  Admin = 'Admin',
  Patient = 'Patient'
}

export interface User {
  id: string;
  role: UserRole;
  email: string;
  password?: string; // Should not be stored long-term, only for mock
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
}

export interface FileAttachment {
  name: string;
  url: string; // base64 string
  type: string;
}

export enum IncidentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Pending = 'Pending',
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string;
  cost?: number;
  treatment?: string;
  status: IncidentStatus;
  nextAppointmentDate?: string;
  files: FileAttachment[];
}
