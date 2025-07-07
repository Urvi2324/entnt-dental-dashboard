
import React, { useState, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { Incident, IncidentStatus } from '../../types';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentsCalendar: React.FC = () => {
  const { incidents, patients, loading } = useData();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, Incident[]>();
    incidents.forEach(inc => {
      if (inc.status === IncidentStatus.Scheduled) {
        const dateStr = format(parseISO(inc.appointmentDate), 'yyyy-MM-dd');
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr)?.push(inc);
      }
    });
    return map;
  }, [incidents]);
  
  const selectedDayAppointments = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    return appointmentsByDay.get(dateStr) || [];
  }, [selectedDay, appointmentsByDay]);

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  if (loading) return <div>Loading calendar...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-textPrimary">Appointments Calendar</h1>
      <div className="bg-surface rounded-xl shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-background"><ChevronLeft /></button>
          <h2 className="text-xl md:text-2xl font-bold text-textPrimary">{format(currentMonth, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-background"><ChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-textSecondary border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dailyAppointments = appointmentsByDay.get(dateStr) || [];
            return (
              <div
                key={day.toString()}
                onClick={() => handleDayClick(day)}
                className={`border-t border-r border-gray-200 min-h-32 p-2 relative cursor-pointer transition-colors ${isSameMonth(day, monthStart) ? 'bg-surface hover:bg-background' : 'bg-gray-50 text-textSecondary hover:bg-gray-100'} ${isSameDay(day, new Date()) ? 'bg-sky-50' : ''} ${isSameDay(day, selectedDay || new Date(0)) ? '!bg-primary/10 border-primary' : ''}`}
              >
                <span className={`font-medium ${isSameDay(day, new Date()) ? 'text-primary font-bold' : ''}`}>{format(day, 'd')}</span>
                <div className="mt-1 space-y-1">
                  {dailyAppointments.slice(0, 2).map(inc => {
                      const patient = patients.find(p => p.id === inc.patientId);
                      return (
                        <div key={inc.id} className="text-xs bg-primary text-white rounded px-1 py-0.5 truncate" title={`${patient?.name}: ${inc.title}`}>
                          {patient?.name}
                        </div>
                      )
                  })}
                  {dailyAppointments.length > 2 && <div className="text-xs text-textSecondary mt-1">+{dailyAppointments.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedDay && (
        <div className="bg-surface rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-textPrimary">Appointments for {format(selectedDay, 'MMMM d, yyyy')}</h3>
            {selectedDayAppointments.length > 0 ? (
                <div className="space-y-3">
                    {selectedDayAppointments
                      .sort((a,b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime())
                      .map(inc => {
                        const patient = patients.find(p => p.id === inc.patientId);
                        return (
                            <Link to={`/patients/${patient?.id}`} key={inc.id} className="block p-3 bg-background hover:bg-gray-200 rounded-lg">
                                <p className="font-semibold text-textPrimary">{patient?.name}</p>
                                <p className="text-sm text-textSecondary">{inc.title}</p>
                                <p className="text-sm font-bold text-primary">{format(parseISO(inc.appointmentDate), 'h:mm a')}</p>
                            </Link>
                        )
                    })}
                </div>
            ) : (
                <p className="text-textSecondary">No scheduled appointments for this day.</p>
            )}
        </div>
      )}
    </div>
  );
};

export default AppointmentsCalendar;
