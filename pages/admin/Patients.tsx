
import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Patient } from '../../types';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInYears, parseISO } from 'date-fns';

const Patients: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (patient: Patient | null = null) => {
    setCurrentPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPatient(null);
  };

  const handleSave = (patientData: Omit<Patient, 'id'> | Patient) => {
    if ('id' in patientData) {
      updatePatient(patientData);
    } else {
      addPatient(patientData);
    }
    closeModal();
  };
  
  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this patient and all their records? This action cannot be undone.')) {
        deletePatient(id);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.includes(searchTerm)
  );
  
  if (loading) return <div>Loading patients...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-textPrimary">Patient Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-hover transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-surface p-4 rounded-xl shadow-md">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={20}/>
            <input
                type="text"
                placeholder="Search by name or contact..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-focus"
            />
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-textSecondary">Name</th>
                <th className="p-4 font-semibold text-textSecondary">Age</th>
                <th className="p-4 font-semibold text-textSecondary">Contact</th>
                <th className="p-4 font-semibold text-textSecondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map(patient => (
                <tr key={patient.id}>
                  <td className="p-4">
                    <Link to={`/patients/${patient.id}`} className="flex items-center space-x-3 group">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <User size={20} className="text-textSecondary"/>
                        </div>
                        <div>
                            <p className="font-medium text-textPrimary group-hover:text-primary transition-colors">{patient.name}</p>
                            <p className="text-sm text-textSecondary">{patient.id}</p>
                        </div>
                    </Link>
                  </td>
                  <td className="p-4 text-textPrimary">{differenceInYears(new Date(), parseISO(patient.dob))}</td>
                  <td className="p-4 text-textPrimary">{patient.contact}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => openModal(patient)} className="p-2 text-textSecondary hover:text-primary transition-colors"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(patient.id)} className="p-2 text-textSecondary hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && <p className="text-center p-4 text-textSecondary">No patients found.</p>}
        </div>
      </div>

      {isModalOpen && <PatientFormModal patient={currentPatient} onSave={handleSave} onClose={closeModal} />}
    </div>
  );
};


interface PatientFormModalProps {
  patient: Patient | null;
  onSave: (patient: Omit<Patient, 'id'> | Patient) => void;
  onClose: () => void;
}

const PatientFormModal: React.FC<PatientFormModalProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    dob: patient?.dob ? format(parseISO(patient.dob), 'yyyy-MM-dd') : '',
    contact: patient?.contact || '',
    healthInfo: patient?.healthInfo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patient) {
      onSave({ ...patient, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-textPrimary">{patient ? 'Edit Patient' : 'Add New Patient'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary">Contact Info</label>
            <input type="tel" name="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary">Health Info</label>
            <textarea name="healthInfo" value={formData.healthInfo} onChange={handleChange} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-textPrimary rounded-md hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">{patient ? 'Save Changes' : 'Add Patient'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Patients;
