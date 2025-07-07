
import React, { useMemo } from 'react';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/StatCard';
import { Users, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Incident, IncidentStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, isAfter, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { patients, incidents, loading } = useData();

  const kpis = useMemo(() => {
    if (loading) return { totalPatients: 0, upcomingAppointments: 0, totalRevenue: 0, completedTreatments: 0, pendingTreatments: 0 };

    const totalRevenue = incidents
      .filter(i => i.status === IncidentStatus.Completed && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    const upcomingAppointments = incidents.filter(i => 
      i.status === IncidentStatus.Scheduled && isAfter(parseISO(i.appointmentDate), new Date())
    ).length;

    const pendingTreatments = incidents.filter(i => i.status === IncidentStatus.Pending).length;

    return {
      totalPatients: patients.length,
      upcomingAppointments,
      totalRevenue,
      completedTreatments: incidents.filter(i => i.status === IncidentStatus.Completed).length,
      pendingTreatments,
    };
  }, [patients, incidents, loading]);

  const nextAppointments = useMemo(() => {
    return incidents
      .filter(i => i.status === IncidentStatus.Scheduled && isAfter(parseISO(i.appointmentDate), new Date()))
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10);
  }, [incidents]);
  
  const revenueData = useMemo(() => {
    const data: { [key: string]: number } = {};
    incidents
      .filter(i => i.status === IncidentStatus.Completed && i.cost)
      .forEach(i => {
        const month = format(parseISO(i.appointmentDate), 'MMM yyyy');
        if (!data[month]) data[month] = 0;
        data[month] += i.cost || 0;
      });
    return Object.keys(data).map(month => ({ name: month, Revenue: data[month] }));
  }, [incidents]);
  
  const topPatients = useMemo(() => {
    const patientIncidentCounts = incidents.reduce((acc, incident) => {
      acc[incident.patientId] = (acc[incident.patientId] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
    
    return patients
    .map(p => ({
        ...p,
        incidentCount: patientIncidentCounts[p.id] || 0
    }))
    .sort((a,b) => b.incidentCount - a.incidentCount)
    .slice(0, 3);

  }, [patients, incidents]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard icon={<Users className="text-white" />} title="Total Patients" value={kpis.totalPatients} color="bg-blue-500" />
        <StatCard icon={<Calendar className="text-white" />} title="Upcoming Appointments" value={kpis.upcomingAppointments} color="bg-amber-500" />
        <StatCard icon={<DollarSign className="text-white" />} title="Total Revenue" value={`₹${kpis.totalRevenue.toLocaleString()}`} color="bg-emerald-500" />
        <StatCard icon={<CheckCircle className="text-white" />} title="Completed Treatments" value={kpis.completedTreatments} color="bg-indigo-500" />
        <StatCard icon={<Clock className="text-white" />} title="Pending Treatments" value={kpis.pendingTreatments} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments List */}
        <div className="bg-surface rounded-xl shadow-md p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Next 10 Appointments</h2>
          <div className="space-y-4 overflow-y-auto" style={{maxHeight: '400px'}}>
            {nextAppointments.length > 0 ? nextAppointments.map(inc => {
              const patient = patients.find(p => p.id === inc.patientId);
              return (
                <div key={inc.id} className="flex items-center space-x-4 p-3 bg-background rounded-lg">
                  <div className="text-center w-16">
                    <p className="font-bold text-primary">{format(parseISO(inc.appointmentDate), 'MMM')}</p>
                    <p className="text-2xl font-bold text-textPrimary">{format(parseISO(inc.appointmentDate), 'dd')}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-textPrimary">{patient?.name}</p>
                    <p className="text-sm text-textSecondary">{inc.title}</p>
                    <p className="text-sm text-textSecondary">{format(parseISO(inc.appointmentDate), 'p')}</p>
                  </div>
                </div>
              );
            }) : <p className="text-textSecondary">No upcoming appointments.</p>}
          </div>
        </div>
        
        {/* Top Patients */}
        <div className="bg-surface rounded-xl shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-textPrimary mb-4">Top Patients by Visits</h2>
            <div className="space-y-3 overflow-y-auto" style={{maxHeight: '400px'}}>
                {topPatients.length > 0 ? topPatients.map(patient => (
                    <Link to={`/patients/${patient.id}`} key={patient.id} className="flex items-center justify-between p-3 bg-background hover:bg-gray-200 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gray-200 text-textPrimary font-semibold p-2 w-10 h-10 flex items-center justify-center rounded-full text-sm">
                                {patient.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-textPrimary">{patient.name}</p>
                                <p className="text-sm text-textSecondary">{patient.id}</p>
                            </div>
                        </div>
                        <span className="font-bold text-primary text-lg">{patient.incidentCount}</span>
                    </Link>
                )) : <p className="text-textSecondary">Not enough data to show top patients.</p>}
            </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-textPrimary mb-4">Monthly Revenue</h2>
          <div style={{ width: '100%', height: 400 }}>
             <ResponsiveContainer>
                <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#10b981" />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
