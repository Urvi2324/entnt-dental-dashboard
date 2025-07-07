
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { Incident, IncidentStatus, FileAttachment } from '../../types';
import { User, Calendar, Phone, Heart, Plus, Edit, Trash2, ChevronLeft, Download, Eye } from 'lucide-react';
import { format, differenceInYears, parseISO } from 'date-fns';
import FileUpload from '../../components/FileUpload';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatientById, getIncidentsByPatientId, addIncident, updateIncident, deleteIncident } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);

  const patient = id ? getPatientById(id) : undefined;
  const incidents = id ? getIncidentsByPatientId(id) : [];

  const openModal = (incident: Incident | null = null) => {
    setCurrentIncident(incident);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentIncident(null);
  };
  
  const handleSaveIncident = (data: Omit<Incident, 'id'> | Incident) => {
    if ('id' in data) {
      updateIncident(data);
    } else {
      addIncident(data);
    }
    closeModal();
  };
  
  const handleDeleteIncident = (incidentId: string) => {
    if(window.confirm('Are you sure you want to delete this incident?')) {
        deleteIncident(incidentId);
    }
  };

  if (!patient) {
    return (
        <div className="text-center p-10">
            <h2 className="text-2xl font-bold">Patient not found</h2>
            <Link to="/patients" className="text-primary hover:underline mt-4 inline-block">Back to Patients List</Link>
        </div>
    );
  }
  
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  return (
    <div className="space-y-6">
        <Link to="/patients" className="flex items-center text-sm text-textSecondary hover:text-textPrimary mb-4">
            <ChevronLeft size={16} className="mr-1"/> Back to Patients
        </Link>
        {/* Patient Info Card */}
        <div className="bg-surface rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-primary-hover/20 text-primary p-4 rounded-full">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-textPrimary">{patient.name}</h1>
                        <p className="text-textSecondary">Patient ID: {patient.id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 md:mt-0 text-sm">
                    <div className="flex items-center text-textPrimary"><Calendar size={14} className="mr-2 text-textSecondary"/> Born {format(parseISO(patient.dob), 'MMMM d, yyyy')} ({differenceInYears(new Date(), parseISO(patient.dob))} years)</div>
                    <div className="flex items-center text-textPrimary"><Phone size={14} className="mr-2 text-textSecondary"/> {patient.contact}</div>
                    <div className="flex items-start col-span-2 mt-1 text-textPrimary"><Heart size={14} className="mr-2 mt-1 text-textSecondary flex-shrink-0"/> <p>{patient.healthInfo}</p></div>
                </div>
            </div>
        </div>

        {/* Incidents Section */}
        <div className="bg-surface rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-textPrimary">Treatment History</h2>
                <button onClick={() => openModal()} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-hover transition-colors">
                    <Plus size={20} className="mr-2" />
                    New Incident
                </button>
            </div>
            <div className="space-y-4">
                {sortedIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} onEdit={openModal} onDelete={handleDeleteIncident} />)}
                {incidents.length === 0 && <p className="text-center p-4 text-textSecondary">No incidents recorded for this patient.</p>}
            </div>
        </div>

        {isModalOpen && patient && <IncidentFormModal patientId={patient.id} incident={currentIncident} onSave={handleSaveIncident} onClose={closeModal} />}
    </div>
  );
};

const statusColors: { [key in IncidentStatus]: string } = {
  [IncidentStatus.Scheduled]: 'bg-blue-100 text-blue-800',
  [IncidentStatus.Completed]: 'bg-green-100 text-green-800',
  [IncidentStatus.Cancelled]: 'bg-red-100 text-red-800',
  [IncidentStatus.Pending]: 'bg-yellow-100 text-yellow-800',
};

const IncidentCard: React.FC<{incident: Incident, onEdit: (i: Incident) => void, onDelete: (id: string) => void}> = ({incident, onEdit, onDelete}) => {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-textPrimary">{incident.title}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[incident.status]}`}>{incident.status}</span>
                    </div>
                    <p className="text-sm text-textSecondary">
                        {format(parseISO(incident.appointmentDate), 'MMMM d, yyyy @ h:mm a')}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(incident)} className="p-2 text-textSecondary hover:text-primary"><Edit size={16}/></button>
                    <button onClick={() => onDelete(incident.id)} className="p-2 text-textSecondary hover:text-red-600"><Trash2 size={16}/></button>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-textSecondary block">Description:</strong> <p className="text-textPrimary">{incident.description}</p></div>
                <div><strong className="text-textSecondary block">Comments:</strong> <p className="text-textPrimary">{incident.comments}</p></div>
                {incident.status === IncidentStatus.Completed && (
                    <>
                        <div><strong className="text-textSecondary block">Cost:</strong> <p className="text-textPrimary">₹{incident.cost}</p></div>
                        <div><strong className="text-textSecondary block">Treatment:</strong> <p className="text-textPrimary">{incident.treatment}</p></div>
                        {incident.nextAppointmentDate && <div><strong className="text-textSecondary block">Next Appointment:</strong> <p className="text-textPrimary">{format(parseISO(incident.nextAppointmentDate), 'MMMM d, yyyy')}</p></div>}
                    </>
                )}
            </div>
             {incident.files.length > 0 && (
                <div className="mt-4">
                    <strong className="text-textSecondary text-sm block mb-2">Attachments:</strong>
                    <div className="flex flex-wrap gap-2">
                        {incident.files.map((file, index) => (
                           <a href={file.url} download={file.name} key={index} className="flex items-center bg-gray-100 hover:bg-gray-200 text-textPrimary text-xs px-2 py-1 rounded-md">
                                {file.type.startsWith('image/') ? <Eye size={14} className="mr-1.5"/> : <Download size={14} className="mr-1.5"/>} {file.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

interface IncidentFormModalProps {
  patientId: string;
  incident: Incident | null;
  onSave: (data: Omit<Incident, 'id'> | Incident) => void;
  onClose: () => void;
}

const IncidentFormModal: React.FC<IncidentFormModalProps> = ({ patientId, incident, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: incident?.title || '',
    description: incident?.description || '',
    comments: incident?.comments || '',
    appointmentDate: incident ? format(parseISO(incident.appointmentDate), "yyyy-MM-dd'T'HH:mm") : '',
    status: incident?.status || IncidentStatus.Scheduled,
    cost: incident?.cost || '',
    treatment: incident?.treatment || '',
    nextAppointmentDate: incident?.nextAppointmentDate ? format(parseISO(incident.nextAppointmentDate), 'yyyy-MM-dd') : '',
    files: incident?.files || [] as FileAttachment[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (newFiles: FileAttachment[]) => {
      setFormData(prev => ({...prev, files: newFiles}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      patientId,
      cost: Number(formData.cost) || undefined,
      appointmentDate: new Date(formData.appointmentDate).toISOString(),
      nextAppointmentDate: formData.nextAppointmentDate || undefined,
    };
    if (incident) {
      onSave({ ...incident, ...dataToSave });
    } else {
      const { ...newIncidentData } = dataToSave;
      onSave(newIncidentData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
      <div className="bg-surface rounded-lg shadow-xl p-8 w-full max-w-2xl my-8">
        <h2 className="text-2xl font-bold mb-6 text-textPrimary">{incident ? 'Edit Incident' : 'New Incident'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary">Appointment Date & Time</label>
              <input type="datetime-local" name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textSecondary">Comments</label>
            <textarea name="comments" value={formData.comments} onChange={handleChange} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-textPrimary mb-2">Post-Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textSecondary">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2">
                  {Object.values(IncidentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-textSecondary">Cost (₹)</label>
                <input type="number" name="cost" value={formData.cost} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mt-4">Treatment Details</label>
              <textarea name="treatment" value={formData.treatment} onChange={handleChange} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-textSecondary mt-4">Next Appointment Date</label>
              <input type="date" name="nextAppointmentDate" value={formData.nextAppointmentDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2" />
            </div>
             <div className="mt-4">
              <label className="block text-sm font-medium text-textSecondary">File Attachments</label>
               <FileUpload files={formData.files} onFilesChange={handleFileChange} />
             </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-textPrimary rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">{incident ? 'Save Changes' : 'Create Incident'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default PatientDetail;
