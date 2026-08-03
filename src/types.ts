export interface Member {
  id: string;
  name: string;
  phone: string;
  monthlyDeposit: number;
  joiningDate: string;
  profileImage?: string;
}

export interface Deposit {
  id: string; // memberId_monthKey
  memberId: string;
  monthKey: string; // YYYY-MM
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

export interface Emi {
  id: string; // loanId_emiNumber
  loanId: string;
  memberId: string;
  monthKey: string; // YYYY-MM
  emiNumber: number; // 1-indexed
  principalComponent: number;
  interestComponent: number;
  totalAmount: number;
  status: 'Paid' | 'Pending';
  paymentDate: string | null;
}

export interface Loan {
  id: string;
  memberId: string;
  principal: number;
  interestRate: number; // monthly % (1% - 10%)
  durationMonths: number;
  startMonthKey: string; // YYYY-MM (loan taken month, EMI starts next month)
  dateIssued: string; // YYYY-MM-DD
  status: 'Active' | 'Closed';
  emis: Emi[];
}

export type TabType = 'dashboard' | 'members' | 'deposits' | 'loans' | 'emis' | 'reports' | 'transactions' | 'more' | 'profile' | 'savings' | 'loan' | 'deposit' | 'withdraw';
export type LanguageType = 'hi' | 'en';
