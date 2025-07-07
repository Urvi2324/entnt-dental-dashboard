
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-surface shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {children}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="text-textSecondary" size={20} />
              <span className="text-sm font-medium text-textPrimary">{user?.email}</span>
              <span className="text-xs font-semibold text-white bg-primary rounded-full px-2 py-0.5">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-textSecondary hover:bg-background hover:text-primary transition-colors"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
