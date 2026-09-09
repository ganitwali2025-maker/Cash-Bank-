import { Member, Deposit, Loan, Emi } from './types';
import { generateEmiSchedule } from './utils/loanCalc';

export const initialMembers: Member[] = [
  { id: 'member-1', name: 'LOKESH RAJAK', phone: '9876543210', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-2', name: 'DIGESH NISHAD', phone: '9812345678', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-3', name: 'GAURAV PANDAY', phone: '9765432109', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-4', name: 'MOHIT THAKUR', phone: '9988776655', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-5', name: 'AJAY NISHAD', phone: '9123456789', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-6', name: 'GAJENDRA SEN', phone: '9345678901', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-7', name: 'ROHIT NISHAD', phone: '9456789012', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-8', name: 'GAUTAM', phone: '9567890123', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-9', name: 'LALA NISHAD', phone: '9678901234', monthlyDeposit: 500, joiningDate: '2026-03-01' },
  { id: 'member-10', name: 'KUNDAN RAJAK', phone: '9789012345', monthlyDeposit: 500, joiningDate: '2026-03-01' }
];

export const getInitialDeposits = (): Deposit[] => {
  return [];
};

export const getInitialLoans = (): Loan[] => {
  return [];
};
