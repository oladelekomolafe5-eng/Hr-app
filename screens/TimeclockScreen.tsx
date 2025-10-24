import React, { useState, useEffect } from 'react';
import { User, Role, TimeEntry } from '../types';
import { MOCK_TIME_ENTRIES, MOCK_WORKSITE, USERS } from '../data/mock';
import { haversineDistance } from '../utils/geo';

interface TimeclockScreenProps {
  currentUser: User;
}

const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export const TimeclockScreen: React.FC<TimeclockScreenProps> = ({ currentUser }) => {
  const [timeEntries, setTimeEntries] = useState(MOCK_TIME_ENTRIES);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [geoStatus, setGeoStatus] = useState<{status: 'checking' | 'in' | 'out' | 'error', message: string}>({status: 'checking', message: 'Checking location...'});
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentUser.role === Role.Employee) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = { lat: position.coords.latitude, lon: position.coords.longitude };
                const distance = haversineDistance(userLocation, MOCK_WORKSITE.location);
                if (distance <= MOCK_WORKSITE.radius) {
                    setGeoStatus({ status: 'in', message: `You are within the ${MOCK_WORKSITE.name} geofence.`});
                } else {
                    setGeoStatus({ status: 'out', message: `You are outside the ${MOCK_WORKSITE.name} geofence.`});
                }
            },
            (error) => {
                 setGeoStatus({ status: 'error', message: 'Could not determine your location.' });
                 console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true }
        );
    }
  }, [currentUser.role]);


  const handleClockToggle = () => {
    if (geoStatus.status === 'out') {
        if (!window.confirm("You are outside the worksite geofence. This will be flagged as an exception. Continue?")) {
            return;
        }
    }
    setIsClockedIn(!isClockedIn);
    // In a real app, this would create/update a time entry record
  }
  
  const handleApproval = (id: string, newStatus: 'approved' | 'denied') => {
      setTimeEntries(prev => prev.map(entry => entry.id === id ? {...entry, status: newStatus} : entry));
  }

  const EmployeeView = () => (
    <div className="flex flex-col items-center">
        <div className="text-center mb-8">
            <p className="text-5xl font-bold text-gray-800">{currentTime.toLocaleTimeString()}</p>
            <p className="text-lg text-gray-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <button 
            onClick={handleClockToggle}
            className={`flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg transition-transform transform hover:scale-105 ${isClockedIn ? 'bg-red-500' : 'bg-green-500'}`}
        >
            <ClockIcon />
            <span className="mt-4 text-3xl font-bold text-white">{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
        </button>
        
        <div className={`mt-6 p-3 rounded-md text-sm ${geoStatus.status === 'in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {geoStatus.message}
        </div>
    </div>
  );

  const ManagerView = () => (
     <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h3>
        <div className="bg-white rounded-lg shadow">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Employee</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Clock In Time</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Reason</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {timeEntries.filter(e => e.status === 'pending').map(entry => {
                        const employee = Object.values(USERS).find(u => u.id === entry.employeeId);
                        return (
                            <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{employee?.name || 'Unknown'}</td>
                                <td className="p-4">{new Date(entry.clockIn).toLocaleString()}</td>
                                <td className="p-4">
                                    {entry.isException && <span className="px-2 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800">Geofence Exception</span>}
                                    {entry.isOffline && <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800 ml-1">Offline Punch</span>}
                                </td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleApproval(entry.id, 'approved')} className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600">Approve</button>
                                    <button onClick={() => handleApproval(entry.id, 'denied')} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">Deny</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
     </div>
  );

  const renderContent = () => {
    switch(currentUser.role) {
        case Role.Employee:
            return <EmployeeView />;
        case Role.Manager:
        case Role.Admin: // Admin can also manage approvals
            return <ManagerView />;
        default:
            return <p>Time & Attendance is not available for your role.</p>
    }
  }

  return (
    <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Time & Attendance</h2>
        {renderContent()}
    </div>
  );
};
