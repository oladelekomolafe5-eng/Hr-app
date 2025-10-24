import React from 'react';
import { User, Role } from '../types';
import { MOCK_LETTERS, MOCK_TIME_ENTRIES, MOCK_PAYROLL, MOCK_LEAVE_REQUESTS } from '../data/mock';

interface DashboardScreenProps {
  currentUser: User;
  onScreenChange: (screen: 'settings' | 'letters' | 'time' | 'leave' | 'paystubs') => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div>{children}</div>
  </div>
);

const Stat: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-4xl font-bold text-kopech-primary">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, onScreenChange }) => {
  
  const AdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="At a Glance">
        <div className="flex justify-around items-center h-full">
          <Stat value={MOCK_LETTERS.filter(l => l.status === 'issued').length} label="Letters to Sign" />
          <Stat value={MOCK_TIME_ENTRIES.filter(t => t.status === 'pending').length} label="Time Approvals" />
          <Stat value={MOCK_LEAVE_REQUESTS.filter(r => r.status === 'Pending').length} label="Leave Requests" />
        </div>
      </Card>
      <Card title="Next Payroll Run">
         <div className="flex flex-col justify-center items-center h-full text-center">
             <p className="text-2xl font-semibold text-gray-700">{new Date(MOCK_PAYROLL.nextRun).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
             <button className="mt-4 px-4 py-2 bg-kopech-primary text-white rounded-md hover:bg-kopech-secondary transition-colors">
                Run Payroll
            </button>
         </div>
      </Card>
      <Card title="Quick Actions">
        <div className="flex flex-col space-y-2">
            <button className="text-left p-2 rounded-md hover:bg-gray-100">Create New Letter</button>
            <button className="text-left p-2 rounded-md hover:bg-gray-100">Add New Employee</button>
            <button className="text-left p-2 rounded-md hover:bg-gray-100">View All Time Entries</button>
        </div>
      </Card>
    </div>
  );

  const ManagerDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <Card title="Team Approvals">
         <div className="flex justify-around items-center h-full">
            <Stat value={MOCK_TIME_ENTRIES.filter(t => t.status === 'pending').length} label="Time Requests" />
            <Stat value={MOCK_LEAVE_REQUESTS.filter(r => r.status === 'Pending').length} label="Leave Requests" />
         </div>
       </Card>
       <Card title="Team Overview">
         <p className="text-gray-600">You have 1 direct report.</p>
         <p className="mt-2 text-gray-600">View team schedule and attendance records.</p>
         <button className="mt-4 px-4 py-2 bg-kopech-primary text-white rounded-md hover:bg-kopech-secondary transition-colors">
                View Team
         </button>
       </Card>
    </div>
  );
  
  const EmployeeDashboard = () => (
     <>
        {currentUser.passwordChangeRequired && (
          <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">Security Alert</p>
            <p>Please update your temporary password. <button onClick={() => onScreenChange('settings')} className="font-bold underline hover:text-orange-800">Go to Settings</button>.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="My Pending Actions">
            <div className="flex justify-center items-center h-full">
              <Stat value={MOCK_LETTERS.filter(l => l.employeeId === currentUser.id && l.status === 'issued').length} label="Letters to Sign" />
            </div>
          </Card>
           <Card title="Quick Links">
             <div className="flex flex-col space-y-2">
                <button onClick={() => onScreenChange('time')} className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors">Clock In / Out</button>
                <button onClick={() => onScreenChange('leave')} className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors">Request Leave</button>
                <button onClick={() => onScreenChange('paystubs')} className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors">View Paystubs</button>
             </div>
           </Card>
        </div>
     </>
  );

  const renderDashboard = () => {
    switch(currentUser.role) {
      case Role.Admin:
        return <AdminDashboard />;
      case Role.Manager:
        return <ManagerDashboard />;
      case Role.Employee:
        return <EmployeeDashboard />;
      default:
        return <p>Welcome!</p>;
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
      {renderDashboard()}
    </div>
  );
};