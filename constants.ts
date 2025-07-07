
import { User, Patient, Incident, UserRole, IncidentStatus } from './types';

export const MOCK_USERS: User[] = [
  { id: "1", role: UserRole.Admin, email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: UserRole.Patient, email: "john@entnt.in", password: "patient123", patientId: "p1" },
  { id: "3", role: UserRole.Patient, email: "jane@entnt.in", password: "patient123", patientId: "p2" }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    dob: "1990-05-10",
    contact: "1234567890",
    healthInfo: "No known allergies. Prefers morning appointments."
  },
  {
    id: "p2",
    name: "Jane Smith",
    dob: "1985-11-22",
    contact: "0987654321",
    healthInfo: "Allergic to penicillin."
  },
   {
    id: "p3",
    name: "Mike Williams",
    dob: "2001-02-15",
    contact: "5551234567",
    healthInfo: "History of dental anxiety."
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "i1",
    patientId: "p1",
    title: "Annual Check-up & Cleaning",
    description: "Routine examination and professional cleaning.",
    comments: "Patient reports no issues.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    status: IncidentStatus.Scheduled,
    files: []
  },
  {
    id: "i2",
    patientId: "p1",
    title: "Toothache Investigation",
    description: "Pain in upper right molar.",
    comments: "Sensitive to cold fluids.",
    appointmentDate: "2024-05-15T14:00:00.000Z",
    cost: 120,
    treatment: "X-ray taken, filling required.",
    status: IncidentStatus.Completed,
    nextAppointmentDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
    files: []
  },
  {
    id: "i3",
    patientId: "p2",
    title: "Wisdom Tooth Consultation",
    description: "Discomfort from lower wisdom tooth.",
    comments: "Area is swollen.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    status: IncidentStatus.Scheduled,
    files: []
  },
  {
    id: "i4",
    patientId: "p3",
    title: "Broken Filling Repair",
    description: "Filling on lower left premolar broke off.",
    comments: "Patient is not in pain but has sharp edge.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    cost: 250,
    treatment: "Replaced composite filling.",
    status: IncidentStatus.Completed,
    files: [],
  },
  {
    id: "i5",
    patientId: "p2",
    title: "Teeth Whitening",
    description: "In-office whitening procedure.",
    comments: "Patient happy with results.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    cost: 450,
    treatment: "Completed whitening treatment.",
    status: IncidentStatus.Completed,
    files: []
  },
  {
    id: "i6",
    patientId: "p3",
    title: "Crown Fitting Prep",
    description: "Preparation for a new crown on upper premolar.",
    comments: "Awaiting lab work.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    status: IncidentStatus.Pending,
    files: []
  },
  {
    id: "i7",
    patientId: "p1",
    title: "Follow-up on Filling",
    description: "Checking sensitivity after new filling.",
    comments: "Patient reports improvement.",
    appointmentDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    cost: 50,
    treatment: "Minor adjustment to filling.",
    status: IncidentStatus.Completed,
    files: []
  },
];
