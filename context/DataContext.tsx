
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { Patient, Incident } from '../types';
import { storageService } from '../services/storageService';
import { MOCK_PATIENTS, MOCK_INCIDENTS } from '../constants';

interface DataContextType {
  patients: Patient[];
  incidents: Incident[];
  loading: boolean;
  getPatientById: (id: string) => Patient | undefined;
  getIncidentsByPatientId: (patientId: string) => Incident[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (incident: Incident) => void;
  deleteIncident: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize data from local storage or mock data
    const storedPatients = storageService.getItem<Patient[]>('patients');
    if (storedPatients) {
      setPatients(storedPatients);
    } else {
      setPatients(MOCK_PATIENTS);
      storageService.setItem('patients', MOCK_PATIENTS);
    }

    const storedIncidents = storageService.getItem<Incident[]>('incidents');
    if (storedIncidents) {
      setIncidents(storedIncidents);
    } else {
      setIncidents(MOCK_INCIDENTS);
      storageService.setItem('incidents', MOCK_INCIDENTS);
    }
    setLoading(false);
  }, []);

  const persistPatients = (newPatients: Patient[]) => {
    setPatients(newPatients);
    storageService.setItem('patients', newPatients);
  };

  const persistIncidents = (newIncidents: Incident[]) => {
    setIncidents(newIncidents);
    storageService.setItem('incidents', newIncidents);
  };
  
  const getPatientById = useCallback((id: string) => patients.find(p => p.id === id), [patients]);
  
  const getIncidentsByPatientId = useCallback((patientId: string) => incidents.filter(i => i.patientId === patientId), [incidents]);

  const addPatient = useCallback((patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patientData, id: `p${Date.now()}` };
    persistPatients([...patients, newPatient]);
  }, [patients]);

  const updatePatient = useCallback((updatedPatient: Patient) => {
    const newPatients = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
    persistPatients(newPatients);
  }, [patients]);

  const deletePatient = useCallback((id: string) => {
    const newPatients = patients.filter(p => p.id !== id);
    persistPatients(newPatients);
    // Also delete their incidents
    const newIncidents = incidents.filter(i => i.patientId !== id);
    persistIncidents(newIncidents);
  }, [patients, incidents]);

  const addIncident = useCallback((incidentData: Omit<Incident, 'id'>) => {
    const newIncident: Incident = { ...incidentData, id: `i${Date.now()}` };
    persistIncidents([...incidents, newIncident]);
  }, [incidents]);

  const updateIncident = useCallback((updatedIncident: Incident) => {
    const newIncidents = incidents.map(i => i.id === updatedIncident.id ? updatedIncident : i);
    persistIncidents(newIncidents);
  }, [incidents]);

  const deleteIncident = useCallback((id: string) => {
    const newIncidents = incidents.filter(i => i.id !== id);
    persistIncidents(newIncidents);
  }, [incidents]);

  const value = {
    patients,
    incidents,
    loading,
    getPatientById,
    getIncidentsByPatientId,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
