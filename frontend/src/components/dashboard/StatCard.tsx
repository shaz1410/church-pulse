import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      {icon && <div className="text-2xl p-3 bg-purple-50 rounded-lg">{icon}</div>}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-extrabold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
};