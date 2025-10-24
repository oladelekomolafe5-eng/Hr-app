import React from 'react';
import { User, Role } from '../types';
import { MOCK_COMPANY, MOCK_WORKSITE } from '../data/mock';

interface SettingsScreenProps {
  currentUser: User;
}

const AccessDenied: React.FC = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
      <p className="font-bold">Access Denied</p>
      <p>You do not have the necessary permissions to view this page.</p>
    </div>
);

const SettingCard: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">{title}</h3>
        {children}
    </div>
);


export const SettingsScreen: React.FC<SettingsScreenProps> = ({ currentUser }) => {
  const isAdmin = currentUser.role === Role.Admin;

  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, this would call an API
      alert("Password changed successfully!");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
      
      {isAdmin && (
        <>
            <SettingCard title="Company Details">
                <p><strong>Company Name:</strong> {MOCK_COMPANY.name}</p>
                <p><strong>Address:</strong> {MOCK_COMPANY.address}</p>
                <p className="mt-2"><strong>Company Logo:</strong></p>
                <div className="flex items-center mt-2">
                    <div className="w-20 h-20 p-2 border rounded-md"><img src="/kopech_logo.png" alt="Company Logo" className="object-contain w-full h-full" onError={(e) => e.currentTarget.style.display = 'none'} /></div>
                    <input type="file" className="ml-4" />
                </div>
            </SettingCard>

            <SettingCard title="Worksites">
                <p><strong>Name:</strong> {MOCK_WORKSITE.name}</p>
                <p><strong>Geofence Radius:</strong> {MOCK_WORKSITE.radius} meters</p>
                <p className="text-gray-600 mt-2">A map interface would be displayed here to manage worksite locations and geofence radii.</p>
            </SettingCard>

            <SettingCard title="Payroll Settings">
                <p>This section will contain settings for pay schedules, tax rates, pension contributions, and other configurable deductions.</p>
            </SettingCard>
        </>
      )}

      <SettingCard title="Security">
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kopech-primary focus:border-kopech-primary"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kopech-primary focus:border-kopech-primary"/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kopech-primary focus:border-kopech-primary"/>
            </div>
            <div>
                <button type="submit" className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg shadow-md hover:bg-kopech-secondary">Change Password</button>
            </div>
        </form>
      </SettingCard>

    </div>
  );
};
