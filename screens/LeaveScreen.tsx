import React, { useState, useMemo } from 'react';
import { User, Role, LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { MOCK_LEAVE_REQUESTS, USERS } from '../data/mock';

// --- MODAL COMPONENT ---
interface RequestLeaveModalProps {
    onClose: () => void;
    onSubmit: (request: Omit<LeaveRequest, 'id' | 'employeeId' | 'status' | 'requestedAt'>) => void;
}

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ onClose, onSubmit }) => {
    const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.Annual);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!startDate || !endDate || !reason) {
            setError('All fields are required.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            setError('Start date cannot be after end date.');
            return;
        }
        onSubmit({ leaveType, startDate, endDate, reason });
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Request Leave</h2>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                        <select value={leaveType} onChange={e => setLeaveType(e.target.value as LeaveType)} className="w-full p-2 mt-1 border rounded-md bg-white">
                            {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-2 mt-1 border rounded-md"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full p-2 mt-1 border rounded-md"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} required rows={3} className="w-full p-2 mt-1 border rounded-md"/>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-kopech-primary text-white font-semibold rounded-md hover:bg-kopech-secondary">Submit Request</button>
                </div>
            </form>
        </div>
    );
};


// --- MAIN SCREEN COMPONENT ---

const statusColorMap: { [key in LeaveStatus]: string } = {
  [LeaveStatus.Pending]: 'bg-yellow-200 text-yellow-800',
  [LeaveStatus.Approved]: 'bg-green-200 text-green-800',
  [LeaveStatus.Denied]: 'bg-red-200 text-red-800',
};

export const LeaveScreen: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
    const [isRequestingLeave, setIsRequestingLeave] = useState(false);
    const [activeTab, setActiveTab] = useState<'team' | 'my'>('team');

    const myRequests = useMemo(() => 
        leaveRequests.filter(r => r.employeeId === currentUser.id)
            .sort((a,b) => b.requestedAt.getTime() - a.requestedAt.getTime()), 
    [leaveRequests, currentUser.id]);

    const teamRequests = useMemo(() =>
        leaveRequests.filter(r => r.employeeId !== currentUser.id) // Simple logic for demo
            .sort((a,b) => b.requestedAt.getTime() - a.requestedAt.getTime()),
    [leaveRequests, currentUser.id]);

    const handleRequestSubmit = (newRequestData: Omit<LeaveRequest, 'id' | 'employeeId' | 'status' | 'requestedAt'>) => {
        const newRequest: LeaveRequest = {
            id: `leave-${Date.now()}`,
            employeeId: currentUser.id,
            ...newRequestData,
            status: LeaveStatus.Pending,
            requestedAt: new Date(),
        };
        setLeaveRequests(prev => [newRequest, ...prev]);
        setIsRequestingLeave(false);
    };

    const handleApproval = (id: string, newStatus: LeaveStatus.Approved | LeaveStatus.Denied) => {
        setLeaveRequests(prev => prev.map(req => req.id === id ? {...req, status: newStatus} : req));
    };

    const LeaveTable: React.FC<{requests: LeaveRequest[], isManagerView?: boolean}> = ({ requests, isManagerView = false }) => (
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {isManagerView && <th className="p-4 text-sm font-semibold text-gray-600">Employee</th>}
                  <th className="p-4 text-sm font-semibold text-gray-600">Leave Type</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Dates</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Requested On</th>
                  {isManagerView && <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map(req => {
                    const employee = Object.values(USERS).find(u => u.id === req.employeeId);
                    const isPending = req.status === LeaveStatus.Pending;
                    return (
                        <tr key={req.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                            {isManagerView && <td className="p-4">{employee?.name || 'Unknown'}</td>}
                            <td className="p-4">{req.leaveType}</td>
                            <td className="p-4">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[req.status]}`}>{req.status}</span>
                            </td>
                            <td className="p-4">{req.requestedAt.toLocaleDateString()}</td>
                            {isManagerView && (
                                <td className="p-4 space-x-2">
                                    {isPending ? (
                                        <>
                                            <button onClick={() => handleApproval(req.id, LeaveStatus.Approved)} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Approve</button>
                                            <button onClick={() => handleApproval(req.id, LeaveStatus.Denied)} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Deny</button>
                                        </>
                                    ) : <span className="text-gray-400 text-sm">Resolved</span>}
                                </td>
                            )}
                        </tr>
                    )
                })}
                {requests.length === 0 && (
                    <tr><td colSpan={isManagerView ? 6 : 4} className="p-4 text-center text-gray-500">No requests found.</td></tr>
                )}
              </tbody>
            </table>
        </div>
    );

    const EmployeeView = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-4xl font-bold text-kopech-primary">{currentUser.leaveBalances?.annual ?? 'N/A'}</p>
                    <p className="text-sm text-gray-500">Annual Leave Days</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center">
                    <p className="text-4xl font-bold text-kopech-primary">{currentUser.leaveBalances?.sick ?? 'N/A'}</p>
                    <p className="text-sm text-gray-500">Sick Leave Days</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center">
                    <button onClick={() => setIsRequestingLeave(true)} className="w-full px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg shadow-md hover:bg-kopech-secondary">
                        Request New Leave
                    </button>
                 </div>
            </div>
             <div className="bg-white rounded-lg shadow">
                 <h3 className="text-lg font-semibold text-gray-800 p-4 border-b">My Leave History</h3>
                 <LeaveTable requests={myRequests} />
            </div>
        </>
    );

    const ManagerAdminView = () => (
        <div className="bg-white rounded-lg shadow">
            <div className="border-b">
                <nav className="flex space-x-4 px-4">
                    <button onClick={() => setActiveTab('team')} className={`py-3 px-2 text-sm font-medium ${activeTab === 'team' ? 'border-b-2 border-kopech-primary text-kopech-primary' : 'text-gray-500 hover:text-gray-700'}`}>Team Requests</button>
                    <button onClick={() => setActiveTab('my')} className={`py-3 px-2 text-sm font-medium ${activeTab === 'my' ? 'border-b-2 border-kopech-primary text-kopech-primary' : 'text-gray-500 hover:text-gray-700'}`}>My Requests</button>
                </nav>
            </div>
            {activeTab === 'team' ? <LeaveTable requests={teamRequests} isManagerView={true} /> : <LeaveTable requests={myRequests} />}
             {activeTab === 'my' && (
                <div className="p-4 border-t">
                     <button onClick={() => setIsRequestingLeave(true)} className="px-4 py-2 bg-kopech-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-kopech-secondary">
                        Request New Leave
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave Management</h2>
            {currentUser.role === Role.Employee ? <EmployeeView /> : <ManagerAdminView />}
            {isRequestingLeave && <RequestLeaveModal onClose={() => setIsRequestingLeave(false)} onSubmit={handleRequestSubmit} />}
        </div>
    );
};