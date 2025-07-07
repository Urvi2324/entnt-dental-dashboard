
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { IncidentStatus, Incident, FileAttachment } from '../../types';
import { format, parseISO, isAfter } from 'date-fns';
import { Calendar, CheckCircle, Clock, DollarSign, FileText, Download, Eye } from 'lucide-react';

const MyApointments: React.FC = () => {
  const { user } = useAuth();
  const { getIncidentsByPatientId, loading } = useData();

  if (loading) {
    return <div>Loading appointments...</div>;
  }
  
  if (!user || !user.patientId) {
    return <div>Could not find patient data.</div>;
  }

  const incidents = getIncidentsByPatientId(user.patientId);
  const upcomingAppointments = incidents
    .filter(i => i.status === IncidentStatus.Scheduled && isAfter(parseISO(i.appointmentDate), new Date()))
    .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
  const pastAppointments = incidents
    .filter(i => i.status !== IncidentStatus.Scheduled || !isAfter(parseISO(i.appointmentDate), new Date()))
    .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">My Appointments</h1>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-2xl font-semibold text-textPrimary mb-4 flex items-center"><Clock size={24} className="mr-3 text-primary" /> Upcoming Appointments</h2>
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(inc => <AppointmentCard key={inc.id} incident={inc} />)
          ) : (
            <div className="bg-surface rounded-xl shadow-md p-6 text-center text-textSecondary">
              You have no upcoming appointments.
            </div>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-2xl font-semibold text-textPrimary mb-4 flex items-center"><CheckCircle size={24} className="mr-3 text-secondary" /> Appointment History</h2>
        <div className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(inc => <AppointmentCard key={inc.id} incident={inc} />)
          ) : (
             <div className="bg-surface rounded-xl shadow-md p-6 text-center text-textSecondary">
              You have no past appointments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const statusColors: { [key in IncidentStatus]: { bg: string; text: string; icon: React.ReactNode } } = {
  [IncidentStatus.Scheduled]: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock size={16} /> },
  [IncidentStatus.Completed]: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={16} /> },
  [IncidentStatus.Cancelled]: { bg: 'bg-red-100', text: 'text-red-800', icon: <Calendar size={16} /> },
  [IncidentStatus.Pending]: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={16} /> },
};


const AppointmentCard: React.FC<{ incident: Incident }> = ({ incident }) => {
  const statusStyle = statusColors[incident.status];

  return (
    <div className="bg-surface rounded-xl shadow-md p-6 transition-shadow hover:shadow-lg">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <h3 className="text-xl font-bold text-textPrimary">{incident.title}</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
          {statusStyle.icon}
          <span>{incident.status}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 text-sm">
        <div className="flex items-center text-textPrimary mb-2">
            <Calendar size={16} className="mr-3 text-textSecondary" />
            <span className="font-semibold">{format(parseISO(incident.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
            <span className="mx-2 text-textSecondary">|</span>
            <span>{format(parseISO(incident.appointmentDate), 'h:mm a')}</span>
        </div>
        <p className="text-textSecondary mb-4">{incident.description}</p>
        
        {incident.status === IncidentStatus.Completed && (
          <div className="bg-background p-4 rounded-lg space-y-3">
             <div className="flex items-center">
                <FileText size={16} className="mr-3 text-secondary"/>
                <div>
                    <p className="font-semibold text-textSecondary">Treatment Received</p>
                    <p className="text-textPrimary">{incident.treatment}</p>
                </div>
             </div>
             <div className="flex items-center">
                <DollarSign size={16} className="mr-3 text-secondary"/>
                 <div>
                    <p className="font-semibold text-textSecondary">Cost</p>
                    <p className="text-textPrimary">₹{incident.cost?.toLocaleString()}</p>
                </div>
             </div>
          </div>
        )}

        {incident.files.length > 0 && (
          <div className="mt-4">
              <h4 className="font-semibold text-textSecondary mb-2">Attached Files</h4>
              <div className="flex flex-wrap gap-2">
                {incident.files.map((file, index) => (
                    <a 
                        href={file.url} 
                        download={file.name} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        key={index} 
                        className="flex items-center bg-gray-200 hover:bg-gray-300 text-textPrimary text-xs px-3 py-1.5 rounded-full"
                    >
                        {file.type.startsWith('image/') ? <Eye size={14} className="mr-1.5"/> : <Download size={14} className="mr-1.5"/>}
                        {file.name}
                    </a>
                ))}
              </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApointments;
