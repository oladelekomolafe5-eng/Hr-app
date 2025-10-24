import React, { useState, useMemo, useEffect } from 'react';
import { User, Role, Paystub } from '../types';
import { MOCK_PAYSTUBS, MOCK_COMPANY } from '../data/mock';
import { KopechLogo } from '../components/KopechLogo';

// --- HELPER & UTILITY COMPONENTS ---

const ProfileDetail: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md text-gray-800">{value || 'N/A'}</p>
    </div>
);

const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};


// --- MODAL COMPONENTS ---

const AddEmployeeModal: React.FC<{
    onClose: () => void;
    onAdd: (newUser: User) => void;
}> = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [role, setRole] = useState<Role>(Role.Employee);
    const [generatedCredentials, setGeneratedCredentials] = useState<{email: string, pass: string} | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !jobTitle) {
            alert("All fields are required.");
            return;
        }

        const newUser: User = {
            id: `user-new-${Date.now()}`,
            name,
            email,
            jobTitle,
            role,
            hireDate: new Date().toISOString().split('T')[0],
            avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
            passwordChangeRequired: true,
            employmentHistory: [{ jobTitle, startDate: new Date().toISOString().split('T')[0] }]
        };

        const tempPassword = generatePassword();
        setGeneratedCredentials({ email: newUser.email, pass: tempPassword });
        onAdd(newUser);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                {generatedCredentials ? (
                     <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Employee Created!</h2>
                        <p className="text-gray-600 mb-4">Please share these temporary credentials with the new employee securely. They will be required to change their password on first login.</p>
                        <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                            <p><strong className="font-medium text-gray-700">Username:</strong> {generatedCredentials.email}</p>
                            <p><strong className="font-medium text-gray-700">Temporary Password:</strong> <span className="font-mono bg-gray-200 p-1 rounded">{generatedCredentials.pass}</span></p>
                        </div>
                        <div className="mt-6 text-right">
                            <button onClick={onClose} className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg">Done</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Employee</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 mt-1 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-2 mt-1 border rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required className="w-full p-2 mt-1 border rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select value={role} onChange={e => setRole(e.target.value as Role)} className="w-full p-2 mt-1 border rounded-md bg-white">
                                    <option value={Role.Employee}>Employee</option>
                                    <option value={Role.Manager}>Manager</option>
                                    <option value={Role.Admin}>Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-kopech-primary text-white font-semibold rounded-md hover:bg-kopech-secondary">Create Employee</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


const PaystubDetailModal: React.FC<{ paystub: Paystub, onClose: () => void }> = ({ paystub, onClose }) => {
    const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between pb-4 border-b mb-4">
                     <div className="flex items-center">
                        <div className="w-12 h-12 mr-4 text-kopech-primary"><KopechLogo/></div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{MOCK_COMPANY.name}</h3>
                            <p className="text-sm text-gray-500">{MOCK_COMPANY.address}</p>
                        </div>
                     </div>
                     <h2 className="text-2xl font-bold text-kopech-primary">Paystub</h2>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <p><strong>Pay Period:</strong> {new Date(paystub.payPeriodStart).toLocaleDateString()} - {new Date(paystub.payPeriodEnd).toLocaleDateString()}</p>
                        <p><strong>Pay Date:</strong> {new Date(paystub.payDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-lg"><strong>Net Pay:</strong> <span className="font-bold text-green-600">{formatNaira(paystub.netPay)}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Earnings</h4>
                        {paystub.earnings.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>{formatNaira(item.amount)}</p></div>)}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <p>Gross Pay</p>
                            <p>{formatNaira(paystub.grossPay)}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Deductions & Taxes</h4>
                        {paystub.deductions.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>({formatNaira(item.amount)})</p></div>)}
                        {paystub.taxes.map((item, i) => <div key={i} className="flex justify-between py-1"><p>{item.description}</p><p>({formatNaira(item.amount)})</p></div>)}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <p>Total Deductions & Taxes</p>
                            <p>({formatNaira(paystub.grossPay - paystub.netPay)})</p>
                        </div>
                    </div>
                </div>

                 <div className="mt-8 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN VIEW COMPONENTS ---

const EmployeeProfile: React.FC<{ employee: User }> = ({ employee }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'paystubs'>('details');
    const [selectedPaystub, setSelectedPaystub] = useState<Paystub | null>(null);
    const employeePaystubs = useMemo(() => MOCK_PAYSTUBS.filter(p => p.employeeId === employee.id), [employee.id]);

    const DetailsTab = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-6">
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 border-b pb-2">Contact Information</h4>
                    <ProfileDetail label="Email Address" value={employee.email} />
                    <ProfileDetail label="Phone Number" value={employee.phone} />
                    <ProfileDetail label="Address" value={employee.address} />
                </div>
                 <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 border-b pb-2">Employment Details</h4>
                    <ProfileDetail label="Role" value={employee.role} />
                    <ProfileDetail label="Job Title" value={employee.jobTitle} />
                    <ProfileDetail label="Hire Date" value={employee.hireDate ? new Date(employee.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
                </div>
            </div>
             <div className="mt-8">
                <h4 className="font-semibold text-gray-700 mb-4">Employment History</h4>
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-medium text-gray-600">Job Title</th>
                                <th className="p-3 font-medium text-gray-600">Start Date</th>
                                <th className="p-3 font-medium text-gray-600">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employee.employmentHistory && employee.employmentHistory.length > 0 ? (
                                employee.employmentHistory.map((entry, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="p-3 text-gray-700">{entry.jobTitle}</td>
                                        <td className="p-3 text-gray-700">{new Date(entry.startDate).toLocaleDateString()}</td>
                                        <td className="p-3 text-gray-700">{entry.endDate ? new Date(entry.endDate).toLocaleDateString() : 'Present'}</td>
                                    </tr>
                                ))
                            ) : (
                                 <tr className="border-t"><td colSpan={3} className="p-3 text-center text-gray-500">No history available.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );

    const PaystubsTab = () => (
         <div className="mt-6">
             <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 font-medium text-gray-600">Pay Period</th>
                            <th className="p-3 font-medium text-gray-600">Pay Date</th>
                            <th className="p-3 font-medium text-gray-600">Net Pay</th>
                            <th className="p-3 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeePaystubs.length > 0 ? (
                            employeePaystubs.map(paystub => (
                                <tr key={paystub.id} className="border-t">
                                    <td className="p-3 text-gray-700">{new Date(paystub.payPeriodStart).toLocaleDateString()} - {new Date(paystub.payPeriodEnd).toLocaleDateString()}</td>
                                    <td className="p-3 text-gray-700">{new Date(paystub.payDate).toLocaleDateString()}</td>
                                    <td className="p-3 text-gray-700 font-medium">₦{paystub.netPay.toLocaleString()}</td>
                                    <td className="p-3 text-gray-700"><button onClick={() => setSelectedPaystub(paystub)} className="px-3 py-1 bg-kopech-primary text-white text-xs rounded-md hover:bg-kopech-secondary">View</button></td>
                                </tr>
                            ))
                        ) : (
                             <tr className="border-t"><td colSpan={4} className="p-3 text-center text-gray-500">No paystubs available.</td></tr>
                        )}
                    </tbody>
                </table>
             </div>
             {selectedPaystub && <PaystubDetailModal paystub={selectedPaystub} onClose={() => setSelectedPaystub(null)} />}
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex items-center pb-6 border-b">
                <img src={employee.avatarUrl} alt={employee.name} className="w-24 h-24 rounded-full mr-6 bg-gray-200" />
                <div>
                    <h3 className="text-2xl font-bold text-kopech-primary">{employee.name}</h3>
                    <p className="text-lg text-gray-600">{employee.jobTitle}</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                </div>
            </div>

            <div className="mt-4 border-b">
                <nav className="flex space-x-4 -mb-px">
                    <button onClick={() => setActiveTab('details')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-kopech-primary text-kopech-primary' : 'text-gray-500 hover:text-gray-700'}`}>Details</button>
                    <button onClick={() => setActiveTab('paystubs')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'paystubs' ? 'border-b-2 border-kopech-primary text-kopech-primary' : 'text-gray-500 hover:text-gray-700'}`}>Paystubs</button>
                </nav>
            </div>
            
            {activeTab === 'details' ? <DetailsTab /> : <PaystubsTab />}
        </div>
    );
};

// --- SCREEN COMPONENT ---
interface EmployeesScreenProps {
  currentUser: User;
  users: User[];
  onAddUser: (newUser: User) => void;
}

export const EmployeesScreen: React.FC<EmployeesScreenProps> = ({ currentUser, users, onAddUser }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);
    
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, users]);

    const [selectedEmployee, setSelectedEmployee] = useState<User | null>(filteredUsers[0] || null);

    useEffect(() => {
        if (filteredUsers.length > 0 && !filteredUsers.find(u => u.id === selectedEmployee?.id)) {
            setSelectedEmployee(filteredUsers[0]);
        } else if (filteredUsers.length === 0) {
            setSelectedEmployee(null);
        }
    }, [filteredUsers, selectedEmployee]);

    return (
        <div>
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Employee Profiles</h2>
                {currentUser.role === Role.Admin && (
                    <button 
                        onClick={() => setIsAddingEmployee(true)}
                        className="px-4 py-2 bg-kopech-primary text-white font-semibold rounded-lg shadow-md hover:bg-kopech-secondary focus:outline-none focus:ring-2 focus:ring-kopech-accent focus:ring-opacity-75"
                    >
                        Add Employee
                    </button>
                )}
            </div>

            <div className="flex bg-white rounded-lg shadow" style={{height: 'calc(100vh - 12rem)'}}>
                <div className="w-1/3 border-r flex flex-col bg-gray-50">
                    <div className="p-4 border-b">
                        <input 
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded-md focus:ring-kopech-primary focus:border-kopech-primary"
                        />
                    </div>
                    <ul className="overflow-y-auto">
                        {filteredUsers.map(user => (
                            <li key={user.id}>
                                <button 
                                    onClick={() => setSelectedEmployee(user)}
                                    className={`w-full text-left p-4 flex items-center border-b transition-colors duration-150 ${selectedEmployee?.id === user.id ? 'bg-kopech-primary text-white' : 'hover:bg-gray-200'}`}
                                >
                                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3 bg-gray-300" />
                                    <div>
                                        <p className={`font-semibold ${selectedEmployee?.id === user.id ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                                        <p className={`text-sm ${selectedEmployee?.id === user.id ? 'text-gray-200' : 'text-gray-500'}`}>{user.jobTitle}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                         {filteredUsers.length === 0 && <p className="p-4 text-center text-gray-500">No employees found.</p>}
                    </ul>
                </div>
                
                <div className="w-2/3 overflow-y-auto">
                    {selectedEmployee ? (
                        <EmployeeProfile employee={selectedEmployee} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-lg">Select an employee to view their profile.</p>
                        </div>
                    )}
                </div>
            </div>

            {isAddingEmployee && (
                <AddEmployeeModal 
                    onClose={() => setIsAddingEmployee(false)}
                    onAdd={(newUser) => {
                        onAddUser(newUser);
                        // Don't close modal, it will show credentials
                    }}
                />
            )}
        </div>
    );
};
