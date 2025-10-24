import { User, Role, Letter, LetterStatus, TimeEntry, LetterTemplate, Paystub, LeaveRequest, LeaveStatus, LeaveType } from '../types';

export const USERS: { [key: string]: User } = {
  admin: { 
    id: 'user-admin-1', 
    name: 'Folake Admin', 
    email: 'admin@kopech.com', 
    role: Role.Admin, 
    jobTitle: 'HR Administrator',
    phone: '08012345678',
    address: '10 Admin Way, Bodija, Ibadan',
    hireDate: '2020-02-10',
    avatarUrl: `https://i.pravatar.cc/150?u=user-admin-1`,
    employmentHistory: [
      { jobTitle: 'HR Assistant', startDate: '2020-02-10', endDate: '2022-01-15' },
      { jobTitle: 'HR Administrator', startDate: '2022-01-16' }
    ],
    passwordChangeRequired: false,
    leaveBalances: { annual: 20, sick: 10 },
  },
  manager: { 
    id: 'user-manager-1', 
    name: 'Bayo Manager', 
    email: 'manager@kopech.com', 
    role: Role.Manager, 
    jobTitle: 'Engineering Manager',
    phone: '08023456789',
    address: '25 Manager Close, Ring Road, Ibadan',
    hireDate: '2019-05-20',
    avatarUrl: `https://i.pravatar.cc/150?u=user-manager-1`,
    employmentHistory: [
      { jobTitle: 'Senior Software Engineer', startDate: '2019-05-20', endDate: '2021-06-30' },
      { jobTitle: 'Engineering Manager', startDate: '2021-07-01' }
    ],
    passwordChangeRequired: false,
    leaveBalances: { annual: 18, sick: 10 },
  },
  employee: { 
    id: 'user-employee-1', 
    name: 'Oladele Komolafe', 
    email: 'oladele@kopech.com', 
    role: Role.Employee, 
    jobTitle: 'Software Engineer',
    phone: '08034567890',
    address: '50 Employee Avenue, Challenge, Ibadan',
    hireDate: '2022-06-01',
    avatarUrl: `https://i.pravatar.cc/150?u=user-employee-1`,
    employmentHistory: [
        { jobTitle: 'Junior Developer', startDate: '2022-06-01', endDate: '2023-12-31' },
        { jobTitle: 'Software Engineer', startDate: '2024-01-01' }
    ],
    passwordChangeRequired: false,
    leaveBalances: { annual: 15, sick: 8 },
  },
  employee2: { 
    id: 'user-employee-2', 
    name: 'Aisha Bello', 
    email: 'aisha@kopech.com', 
    role: Role.Employee, 
    jobTitle: 'UI/UX Designer',
    phone: '08045678901',
    address: '15 Designer Street, Jericho, Ibadan',
    hireDate: '2023-03-15',
    avatarUrl: `https://i.pravatar.cc/150?u=user-employee-2`,
    employmentHistory: [
        { jobTitle: 'UI/UX Designer', startDate: '2023-03-15' }
    ],
    passwordChangeRequired: true,
    leaveBalances: { annual: 12, sick: 10 },
  }
};

export const MOCK_COMPANY = {
    name: "Kopech Solutions Ltd",
    address: "Ibadan, Oyo State, Nigeria"
};

export const MOCK_WORKSITE = {
    name: "Ibadan HQ",
    location: { lat: 8.5204, lon: 3.9174 }, // Approx. center of Ibadan
    radius: 150, // meters
};

export const MOCK_LETTER_TEMPLATES: LetterTemplate[] = [
    {
        id: 'offer-letter-1',
        name: 'Standard Offer Letter',
        description: 'The official employment offer letter for new hires.',
        content: `
<p class="mb-4">We are pleased to offer you employment at <strong>{{CompanyName}}</strong> for the position of <strong>{{JobTitle}}</strong>, effective <strong>{{StartDate}}</strong>.</p>
<p class="mb-4">Your starting remuneration will be <strong>₦{{Salary}}</strong> per month, paid on a {{PayFrequency}} basis. Your primary work location will be at our office in {{WorkLocation}}.</p>
<p class="mb-8">This offer is contingent upon the successful completion of any background checks and your ability to provide proof of your legal right to work in Nigeria.</p>
<p class="mb-4">Please indicate your acceptance of this offer by signing and returning a copy of this letter.</p>
<p>We are excited to have you join our team and look forward to a successful collaboration.</p>
<br>
<p>Sincerely,</p>
<p class="font-semibold">{{AdminName}}</p>
<p>Human Resources, {{CompanyName}}</p>
`
    },
    {
        id: 'promotion-letter-1',
        name: 'Promotion Letter',
        description: 'A letter to confirm an employee\'s promotion to a new role.',
        content: `
<p class="mb-4">We are delighted to formally announce your promotion to the position of <strong>{{NewJobTitle}}</strong>, effective <strong>{{EffectiveDate}}</strong>.</p>
<p class="mb-4">This promotion is a recognition of your hard work, dedication, and significant contributions to {{CompanyName}}. We are confident that you will bring the same level of commitment and excellence to your new role.</p>
<p class="mb-4">In your new position, your monthly salary will be adjusted to <strong>₦{{NewSalary}}</strong>.</p>
<p class="mb-8">Please sign this letter to acknowledge your acceptance of this promotion and the updated terms of your employment.</p>
<p>Congratulations on your well-deserved promotion!</p>
<br>
<p>Sincerely,</p>
<p class="font-semibold">{{AdminName}}</p>
<p>Human Resources, {{CompanyName}}</p>
`
    }
];


export const MOCK_LETTERS: Letter[] = [
  {
    id: 'letter-1',
    employeeId: USERS.employee.id,
    templateId: 'offer-letter-1',
    status: LetterStatus.Draft,
    variables: {
      EmployeeName: USERS.employee.name,
      JobTitle: 'Senior Software Engineer',
      StartDate: '2024-08-01',
      Salary: '550,000',
      PayFrequency: 'Monthly',
      WorkLocation: MOCK_WORKSITE.name,
      CompanyName: MOCK_COMPANY.name,
      CompanyAddress: MOCK_COMPANY.address,
      AdminName: USERS.admin.name
    },
  },
  {
    id: 'letter-2',
    employeeId: USERS.employee.id,
    templateId: 'offer-letter-1',
    status: LetterStatus.Issued,
    issuedAt: new Date('2024-07-10T10:00:00Z'),
    adminSignatureId: 'sig-admin-2',
    variables: {
      EmployeeName: USERS.employee.name,
      JobTitle: 'Software Engineer',
      StartDate: '2023-01-15',
      Salary: '400,000',
      PayFrequency: 'Monthly',
      WorkLocation: MOCK_WORKSITE.name,
      CompanyName: MOCK_COMPANY.name,
      CompanyAddress: MOCK_COMPANY.address,
      AdminName: USERS.admin.name
    },
  },
    {
    id: 'letter-3',
    employeeId: USERS.employee.id,
    templateId: 'offer-letter-1',
    status: LetterStatus.Locked,
    issuedAt: new Date('2023-01-05T09:00:00Z'),
    lockedAt: new Date('2023-01-06T14:30:00Z'),
    adminSignatureId: 'sig-admin-3',
    employeeSignatureId: 'sig-emp-3',
    variables: {
      EmployeeName: USERS.employee.name,
      JobTitle: 'Junior Developer',
      StartDate: '2022-06-01',
      Salary: '250,000',
      PayFrequency: 'Monthly',
      WorkLocation: MOCK_WORKSITE.name,
      CompanyName: MOCK_COMPANY.name,
      CompanyAddress: MOCK_COMPANY.address,
      AdminName: USERS.admin.name
    },
  },
];

export const MOCK_SIGNATURES = {
    'sig-admin-2': { id: 'sig-admin-2', userId: USERS.admin.id, signedAt: new Date('2024-07-10T09:58:00Z'), imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
    'sig-admin-3': { id: 'sig-admin-3', userId: USERS.admin.id, signedAt: new Date('2023-01-05T08:55:00Z'), imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
    'sig-emp-3': { id: 'sig-emp-3', userId: USERS.employee.id, signedAt: new Date('2023-01-06T14:29:00Z'), imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' },
}

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
    { id: 'time-1', employeeId: USERS.employee.id, clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000), clockOut: new Date(Date.now() - 10 * 60 * 1000), isException: false, isOffline: false, status: 'approved' },
    { id: 'time-2', employeeId: USERS.employee.id, clockIn: new Date(Date.now() - 24 * 60 * 60 * 1000), isException: true, isOffline: false, status: 'pending' },
     { id: 'time-3', employeeId: 'user-employee-2', clockIn: new Date(Date.now() - 26 * 60 * 60 * 1000), isException: false, isOffline: true, status: 'pending' }
];

export const MOCK_PAYROLL = {
    nextRun: '2024-08-31',
    pendingApprovals: 2,
};


export const MOCK_PAYSTUBS: Paystub[] = [
    {
        id: 'ps-1',
        employeeId: USERS.employee.id,
        payPeriodStart: '2024-06-01',
        payPeriodEnd: '2024-06-30',
        payDate: '2024-06-28',
        grossPay: 400000.00,
        netPay: 355500.00,
        earnings: [
            { description: 'Base Salary', amount: 400000.00 }
        ],
        deductions: [
            { description: 'Pension Contribution', amount: 12000.00 },
            { description: 'NHF Contribution', amount: 2500.00 }
        ],
        taxes: [
            { description: 'PAYE Tax', amount: 30000.00 }
        ]
    },
    {
        id: 'ps-2',
        employeeId: USERS.employee.id,
        payPeriodStart: '2024-07-01',
        payPeriodEnd: '2024-07-31',
        payDate: '2024-07-29',
        grossPay: 415000.00,
        netPay: 368250.00,
        earnings: [
            { description: 'Base Salary', amount: 400000.00 },
            { description: 'Performance Bonus', amount: 15000.00 }
        ],
        deductions: [
            { description: 'Pension Contribution', amount: 12000.00 },
            { description: 'NHF Contribution', amount: 2500.00 }
        ],
        taxes: [
            { description: 'PAYE Tax', amount: 32250.00 }
        ]
    },
     {
        id: 'ps-3',
        employeeId: USERS.employee2.id,
        payPeriodStart: '2024-07-01',
        payPeriodEnd: '2024-07-31',
        payDate: '2024-07-29',
        grossPay: 350000.00,
        netPay: 310500.00,
        earnings: [
            { description: 'Base Salary', amount: 350000.00 }
        ],
        deductions: [
            { description: 'Pension Contribution', amount: 10000.00 },
            { description: 'NHF Contribution', amount: 2500.00 }
        ],
        taxes: [
            { description: 'PAYE Tax', amount: 27000.00 }
        ]
    },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
    {
        id: 'leave-1',
        employeeId: USERS.employee.id,
        leaveType: LeaveType.Annual,
        startDate: '2024-08-20',
        endDate: '2024-08-22',
        reason: 'Short vacation.',
        status: LeaveStatus.Approved,
        requestedAt: new Date('2024-07-15T10:00:00Z'),
    },
    {
        id: 'leave-2',
        employeeId: USERS.employee2.id,
        leaveType: LeaveType.Sick,
        startDate: '2024-07-25',
        endDate: '2024-07-25',
        reason: 'Feeling unwell.',
        status: LeaveStatus.Approved,
        requestedAt: new Date('2024-07-25T08:00:00Z'),
    },
    {
        id: 'leave-3',
        employeeId: USERS.employee.id,
        leaveType: LeaveType.Annual,
        startDate: '2024-09-02',
        endDate: '2024-09-06',
        reason: 'Family event.',
        status: LeaveStatus.Pending,
        requestedAt: new Date('2024-07-28T14:30:00Z'),
    },
];