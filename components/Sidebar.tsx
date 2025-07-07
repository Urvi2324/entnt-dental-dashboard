
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { LayoutDashboard, Users, Calendar, UserCircle, CalendarClock, X } from 'lucide-react';

const adminNavLinks = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
  { to: '/patients', icon: <Users size={20} />, text: 'Patients' },
  { to: '/appointments', icon: <Calendar size={20} />, text: 'Calendar' },
];

const patientNavLinks = [
  { to: '/my-appointments', icon: <CalendarClock size={20} />, text: 'My Appointments' },
  { to: '/my-profile', icon: <UserCircle size={20} />, text: 'My Profile' },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const navLinks = user?.role === UserRole.Admin ? adminNavLinks : patientNavLinks;

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-sky-700 hover:text-white rounded-lg transition-colors";
  const activeLinkClasses = "bg-sky-700 text-white";

  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed lg:relative inset-y-0 left-0 bg-slate-800 text-white w-64 space-y-6 py-7 px-4 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col`}>
        <div className="flex items-center justify-between">
            <a href="#" className="text-white text-2xl font-extrabold flex items-center">
                <img src="/logo.jpg" alt="ENTNT Logo" className="h-8 w-8 mr-2" />
                ENTNT
            </a>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                <X size={24} />
            </button>
        </div>
        <nav className="flex-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : ''}`
              }
            >
              {link.icon}
              <span className="ml-3">{link.text}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
