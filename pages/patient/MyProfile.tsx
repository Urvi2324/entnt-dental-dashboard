
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { User, Calendar, Phone, Heart, Mail } from 'lucide-react';
import { format, parseISO, differenceInYears } from 'date-fns';

const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const { getPatientById, loading } = useData();

  if (loading) {
    return <div>Loading profile...</div>;
  }
  
  if (!user || !user.patientId) {
    return <div>Could not find patient profile.</div>;
  }
  
  const patient = getPatientById(user.patientId);
  
  if (!patient) {
     return <div>Could not find patient profile data.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">My Profile</h1>
      <div className="bg-surface rounded-xl shadow-md p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <div className="bg-primary-hover/20 text-primary p-5 rounded-full">
                <User size={48} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-textPrimary text-center sm:text-left">{patient.name}</h2>
                <p className="text-textSecondary text-center sm:text-left">Patient ID: {patient.id}</p>
            </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <div className="flex items-start">
                    <Mail size={20} className="mr-3 mt-1 text-textSecondary flex-shrink-0" />
                    <div>
                        <dt className="text-sm font-medium text-textSecondary">Email Address</dt>
                        <dd className="mt-1 text-base text-textPrimary">{user.email}</dd>
                    </div>
                </div>
                <div className="flex items-start">
                    <Phone size={20} className="mr-3 mt-1 text-textSecondary flex-shrink-0" />
                    <div>
                        <dt className="text-sm font-medium text-textSecondary">Contact Number</dt>
                        <dd className="mt-1 text-base text-textPrimary">{patient.contact}</dd>
                    </div>
                </div>
                <div className="flex items-start">
                    <Calendar size={20} className="mr-3 mt-1 text-textSecondary flex-shrink-0" />
                    <div>
                        <dt className="text-sm font-medium text-textSecondary">Date of Birth</dt>
                        <dd className="mt-1 text-base text-textPrimary">
                            {format(parseISO(patient.dob), 'MMMM d, yyyy')} ({differenceInYears(new Date(), parseISO(patient.dob))} years old)
                        </dd>
                    </div>
                </div>
                <div className="flex items-start">
                    <Heart size={20} className="mr-3 mt-1 text-textSecondary flex-shrink-0" />
                    <div>
                        <dt className="text-sm font-medium text-textSecondary">Health Information</dt>
                        <dd className="mt-1 text-base text-textPrimary">{patient.healthInfo}</dd>
                    </div>
                </div>
            </dl>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
