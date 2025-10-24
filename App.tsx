import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './screens/DashboardScreen';
import { EmployeesScreen } from './screens/EmployeesScreen';
import { LettersScreen } from './screens/LettersScreen';
import { TimeclockScreen } from './screens/TimeclockScreen';
import { LeaveScreen } from './screens/LeaveScreen';
import { PayrollScreen } from './screens/PayrollScreen';
import { PaystubsScreen } from './screens/PaystubsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { User, Role } from './types';
import { USERS } from './data/mock';
import { KopechLogo } from './components/KopechLogo';

type Screen = 'dashboard' | 'employees' | 'letters' | 'time' | 'payroll' | 'paystubs' | 'settings' | 'leave';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [users, setUsers] = useState(USERS);
  const [currentUser, setCurrentUser] = useState<User>(users.admin);
  
  const handleAddUser = (newUser: User) => {
      const newUsers = {...users, [newUser.id]: newUser};
      setUsers(newUsers);
  };

  const handleScreenChange = (screen: Screen) => {
    setActiveScreen(screen);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const user = Object.values(users).find(u => u.id === event.target.value);
    if (user) {
      setCurrentUser(user);
      setActiveScreen('dashboard');
    }
  };

  const CurrentScreen = useMemo(() => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen currentUser={currentUser} onScreenChange={handleScreenChange} />;
      case 'employees':
        return <EmployeesScreen currentUser={currentUser} users={Object.values(users)} onAddUser={handleAddUser}/>;
      case 'letters':
        return <LettersScreen currentUser={currentUser} />;
      case 'time':
        return <TimeclockScreen currentUser={currentUser} />;
      case 'leave':
        return <LeaveScreen currentUser={currentUser} />;
      case 'payroll':
        return <PayrollScreen currentUser={currentUser} />;
       case 'paystubs':
        return <PaystubsScreen currentUser={currentUser} />;
      case 'settings':
        return <SettingsScreen currentUser={currentUser} />;
      default:
        return <DashboardScreen currentUser={currentUser} onScreenChange={handleScreenChange} />;
    }
  }, [activeScreen, currentUser, users]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeScreen={activeScreen} onScreenChange={handleScreenChange} currentUser={currentUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2"><KopechLogo /></div>
            <h1 className="text-xl font-bold text-kopech-primary">Kopech Smart HR & Payroll</h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Viewing as:</span>
            <select
              value={currentUser.id}
              onChange={handleUserChange}
              className="p-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-kopech-primary"
            >
              {Object.values(users).map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {CurrentScreen}
        </main>
      </div>
    </div>
  );
};

export default App;