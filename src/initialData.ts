import { Member, Deposit, Loan, Emi } from './types';
import { generateEmiSchedule } from './utils/loanCalc';

export const initialMembers: Member[] = [
  { id: 'member-1', name: 'रमेश कुमार (Ramesh Kumar)', phone: '9876543210', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-2', name: 'सुरेश चन्द्र (Suresh Chandra)', phone: '9812345678', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-3', name: 'सुनीता देवी (Sunita Devi)', phone: '9765432109', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-4', name: 'राजेश शर्मा (Rajesh Sharma)', phone: '9988776655', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-5', name: 'अनीता वर्मा (Anita Verma)', phone: '9123456789', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-6', name: 'महेंद्र सिंह (Mahendra Singh)', phone: '9345678901', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-7', name: 'गीता यादव (Geeta Yadav)', phone: '9456789012', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-8', name: 'संजय गुप्ता (Sanjay Gupta)', phone: '9567890123', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-9', name: 'पिंकी शर्मा (Pinky Sharma)', phone: '9678901234', monthlyDeposit: 1000, joiningDate: '2026-01-01' },
  { id: 'member-10', name: 'विक्रम राठौड़ (Vikram Rathore)', phone: '9789012345', monthlyDeposit: 1000, joiningDate: '2026-01-01' }
];

// Seed deposits from Jan 2026 to June 2026 (fully paid)
// July 2026 is the active month with pending deposits
export const getInitialDeposits = (): Deposit[] => {
  const deposits: Deposit[] = [];
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  
  initialMembers.forEach(member => {
    months.forEach((month, idx) => {
      deposits.push({
        id: `${member.id}_${month}`,
        memberId: member.id,
        monthKey: month,
        amount: member.monthlyDeposit,
        date: `${month}-${10 + (idx % 5)}`, // Paid around 10th to 14th of the month
        status: 'Paid'
      });
    });
  });
  
  return deposits;
};

// Seed loans and paid EMIs
export const getInitialLoans = (): Loan[] => {
  // Loan 1: Ramesh Kumar
  // Taken in Feb 2026, Principal: 10000, 2% interest, 5 months.
  // EMIs due: March, April, May, June, July 2026.
  // March, April, May, June are Paid. July is Pending.
  const loan1Id = 'loan-1';
  const loan1 = {
    id: loan1Id,
    memberId: 'member-1',
    principal: 10000,
    interestRate: 2,
    durationMonths: 5,
    startMonthKey: '2026-02',
    dateIssued: '2026-02-15',
    status: 'Active' as const,
    emis: generateEmiSchedule(loan1Id, 'member-1', 10000, 2, 5, '2026-02')
  };

  // Mark March, April, May, June EMIs as Paid
  loan1.emis = loan1.emis.map(emi => {
    if (['2026-03', '2026-04', '2026-05', '2026-06'].includes(emi.monthKey)) {
      return {
        ...emi,
        status: 'Paid',
        paymentDate: `${emi.monthKey}-10`
      };
    }
    return emi;
  });

  // Loan 2: Sunita Devi
  // Taken in May 2026, Principal: 20000, 1.5% interest, 6 months.
  // EMIs due: June, July, August, September, October, November 2026.
  // June is Paid. July onwards are Pending.
  const loan2Id = 'loan-2';
  const loan2 = {
    id: loan2Id,
    memberId: 'member-3',
    principal: 20000,
    interestRate: 1.5,
    durationMonths: 6,
    startMonthKey: '2026-05',
    dateIssued: '2026-05-10',
    status: 'Active' as const,
    emis: generateEmiSchedule(loan2Id, 'member-3', 20000, 1.5, 6, '2026-05')
  };

  // Mark June EMI as Paid
  loan2.emis = loan2.emis.map(emi => {
    if (emi.monthKey === '2026-06') {
      return {
        ...emi,
        status: 'Paid',
        paymentDate: '2026-06-12'
      };
    }
    return emi;
  });

  return [loan1, loan2];
};
