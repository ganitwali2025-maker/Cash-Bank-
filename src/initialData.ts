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
  const deposits: Deposit[] = [];
  // Months: March, April, May, June, July 2026
  const months = ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
  
  initialMembers.forEach(member => {
    months.forEach((month, idx) => {
      deposits.push({
        id: `${member.id}_${month}`,
        memberId: member.id,
        monthKey: month,
        amount: member.monthlyDeposit,
        date: `${month}-${10 + (idx % 5)}`,
        status: 'Paid'
      });
    });
  });
  
  return deposits;
};

export const getInitialLoans = (): Loan[] => {
  // Loan 1: LOKESH RAJAK
  const loan1Id = 'loan-1';
  const loan1 = {
    id: loan1Id,
    memberId: 'member-1',
    principal: 1500,
    interestRate: 1, // 1%
    durationMonths: 24,
    startMonthKey: '2026-03',
    dateIssued: '2026-03-15',
    status: 'Active' as const,
    emis: generateEmiSchedule(loan1Id, 'member-1', 1500, 1, 24, '2026-03')
  };

  // Loan 2: DIGESH NISHAD
  const loan2Id = 'loan-2';
  const loan2 = {
    id: loan2Id,
    memberId: 'member-2',
    principal: 500,
    interestRate: 1, // 1%
    durationMonths: 24,
    startMonthKey: '2026-03',
    dateIssued: '2026-03-15',
    status: 'Active' as const,
    emis: generateEmiSchedule(loan2Id, 'member-2', 500, 1, 24, '2026-03')
  };

  // Loan 3: GAURAV PANDAY
  const loan3Id = 'loan-3';
  const loan3 = {
    id: loan3Id,
    memberId: 'member-3',
    principal: 20000,
    interestRate: 1, // 1%
    durationMonths: 24,
    startMonthKey: '2026-03',
    dateIssued: '2026-03-15',
    status: 'Active' as const,
    emis: generateEmiSchedule(loan3Id, 'member-3', 20000, 1, 24, '2026-03')
  };

  // Keep EMIs as pending initially, user can mark them paid from the UI.
  return [loan1, loan2, loan3];
};
