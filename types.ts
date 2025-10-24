export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  Employee = 'Employee',
}

export interface EmploymentHistoryEntry {
  jobTitle: string;
  startDate: string; // Using string for simplicity in mock data
  endDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  jobTitle: string;
  phone?: string;
  address?: string;
  hireDate?: string;
  employmentHistory?: EmploymentHistoryEntry[];
  avatarUrl?: string;
  passwordChangeRequired?: boolean;
  leaveBalances?: {
    annual: number;
    sick: number;
  };
}

export enum LetterStatus {
  Draft = 'draft',
  Issued = 'issued',
  EmployeeSigned = 'employee_signed',
  Locked = 'locked',
  Void = 'void',
}

export interface Signature {
  id: string;
  userId: string;
  signedAt: Date;
  imageUrl: string; // data URL
}

export interface LetterTemplate {
  id: string;
  name: string;
  description: string;
  content: string; // e.g. "Dear {{EmployeeName}}, we are pleased to offer you..."
}

export interface Letter {
  id: string;
  employeeId: string;
  templateId: string;
  status: LetterStatus;
  variables: { [key: string]: string };
  adminSignatureId?: string;
  employeeSignatureId?: string;
  issuedAt?: Date;
  lockedAt?: Date;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  clockIn: Date;
  clockOut?: Date;
  isException: boolean;
  isOffline: boolean;
  status: 'pending' | 'approved' | 'denied';
}

export interface PaystubItem {
  description: string;
  amount: number;
}

export interface Paystub {
  id: string;
  employeeId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  earnings: PaystubItem[];
  deductions: PaystubItem[];
  taxes: PaystubItem[];
}

export enum LeaveType {
  Annual = 'Annual',
  Sick = 'Sick',
  Unpaid = 'Unpaid',
}

export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  requestedAt: Date;
}