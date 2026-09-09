import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterModal } from './RegisterModal';

interface QuickActionProps {
  onMemberAdded?: () => void;
}

export const QuickAction: React.FC<QuickActionProps> = ({ onMemberAdded }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("Register button clicked! Setting isModalOpen to true.");
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>

        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-colors text-gray-700 font-medium flex items-center gap-3 cursor-pointer"
        >
          <span className="text-purple-600 text-lg">➕</span> Register a Member
        </button>

        <button
          type="button"
          onClick={() => navigate('/members')}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-colors text-gray-700 font-medium flex items-center gap-3 cursor-pointer"
        >
          <span className="text-purple-600 text-lg">👥</span> View Members
        </button>

        <button
          type="button"
          onClick={() => alert('Generating report feature coming next!')}
          className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-colors text-gray-700 font-medium flex items-center gap-3 cursor-pointer"
        >
          <span className="text-purple-600 text-lg">📊</span> Generate Reports
        </button>
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onMemberAdded={onMemberAdded}
      />
    </>
  );
};