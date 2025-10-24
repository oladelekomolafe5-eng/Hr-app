import React from 'react';
import { User, Role } from '../types';
import { KopechLogo } from './KopechLogo';

interface SidebarProps {
  activeScreen: string;
  onScreenChange: (screen: any) => void;
  currentUser: User;
}

const NavLink: React.FC<{
  label: string;
  screen: string;
  activeScreen: string;
  onClick: (screen: string) => void;
  // Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
  icon: React.ReactNode;
}> = ({ label, screen, activeScreen, onClick, icon }) => (
  <button
    onClick={() => onClick(screen)}
    className={`flex items-center w-full px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
      activeScreen === screen
        ? 'bg-kopech-accent text-white'
        : 'text-gray-300 hover:bg-kopech-secondary hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const EmployeesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LettersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LeaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TimeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PayrollIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const PaystubsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const getNavLinks = (role: Role) => {
    const allLinks = [
        { screen: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { screen: 'employees', label: 'Employees', icon: <EmployeesIcon /> },
        { screen: 'letters', label: 'Letters', icon: <LettersIcon /> },
        { screen: 'leave', label: 'Leave', icon: <LeaveIcon /> },
        { screen: 'time', label: 'Time & Attendance', icon: <TimeIcon /> },
        { screen: 'paystubs', label: 'My Paystubs', icon: <PaystubsIcon /> },
        { screen: 'payroll', label: 'Payroll', icon: <PayrollIcon /> },
        { screen: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];
    switch(role) {
        case Role.Admin:
            return allLinks.filter(l => l.screen !== 'paystubs');
        case Role.Manager:
            return allLinks.filter(l => ['dashboard', 'employees', 'letters', 'leave', 'time', 'settings'].includes(l.screen));
        case Role.Employee:
            return allLinks.filter(l => ['dashboard', 'letters', 'leave', 'time', 'paystubs', 'settings'].includes(l.screen));
        default:
            return [];
    }
}


export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onScreenChange, currentUser }) => {
    const navLinks = getNavLinks(currentUser.role);
    return (
        <div className="flex flex-col w-64 bg-kopech-primary text-white">
            <div className="flex items-center justify-center h-20 border-b border-kopech-secondary">
                <div className="w-10 h-10 mr-2 text-white"><KopechLogo /></div>
                <h1 className="text-xl font-bold">Kopech HR</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navLinks.map(({ screen, label, icon }) => (
                    <NavLink
                        key={screen}
                        label={label}
                        screen={screen}
                        activeScreen={activeScreen}
                        onClick={onScreenChange}
                        icon={icon}
                    />
                ))}
            </nav>
        </div>
    );
};