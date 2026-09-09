import React from 'react';

interface Member {
  id: number;
  name: string;
  joinedDate: string;
}

interface RecentMembersProps {
  members?: Member[];
}

export const RecentMembers: React.FC<RecentMembersProps> = ({ members = [] }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Registrations</h3>

      {members.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent member registrations found.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {members.map((member) => (
            <div key={member.id} className="py-3 flex justify-between items-center text-sm">
              <span className="font-medium text-gray-800">{member.name}</span>
              <span className="text-gray-400 text-xs">
                {new Date(member.joinedDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};