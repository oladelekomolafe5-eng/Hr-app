import React from 'react';
import { User, Role } from '../types';

interface PayrollScreenProps {
  currentUser: User;
}

const AccessDenied: React.FC = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
      <p className="font-bold">Access Denied</p>
      <p>You do not have the necessary permissions to view this page.</p>
    </div>
);

export const PayrollScreen: React.FC<PayrollScreenProps> = ({ currentUser }) => {
  if (currentUser.role !== Role.Admin) {
    return <AccessDenied />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payroll</h2>
        <button className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg shadow-md hover:bg-kopech-secondary focus:outline-none focus:ring-2 focus:ring-kopech-accent focus:ring-opacity-75">
            Start New Payroll Run
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Payroll History</h3>
        <p className="text-gray-600">
            This section will display past payroll runs, including dates, total amounts, and links to detailed reports and generated paystubs. The "Run Payroll" button will launch a multi-step wizard to guide the administrator through the process of calculating earnings, deductions, and finalizing payments.
        </p>
      </div>
    </div>
  );
};
