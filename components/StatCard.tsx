
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => {
  return (
    <div className="bg-surface rounded-xl shadow-md p-5 flex items-center space-x-4">
      <div className={`rounded-full p-3 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-textSecondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-textPrimary">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
