import React from 'react';
import { 
  Users, 
  PiggyBank, 
  HandCoins, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  CheckCircle2,
  Undo2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LineChart,
  Landmark,
  BarChart3,
  User,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Member, Deposit, Loan, Emi, LanguageType } from '../types';
import { translations } from '../translations';
import { formatMonthLabel } from './Header';

interface DashboardProps {
  members: Member[];
  deposits: Deposit[];
  loans: Loan[];
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
  language: LanguageType;
  onRecordDeposit: (memberId: string, amount: number, date: string) => void;
  onUndoDeposit: (memberId: string) => void;
  onRecordEmiPayment: (loanId: string, emiNumber: number, date: string) => void;
  onUndoEmiPayment: (loanId: string, emiNumber: number) => void;
  onNavigateToMember: (memberId: string) => void;
}

export default function Dashboard({
  members,
  deposits,
  loans,
  selectedMonth,
  setSelectedMonth,
  language,
  onRecordDeposit,
  onUndoDeposit,
  onRecordEmiPayment,
  onUndoEmiPayment,
  onNavigateToMember
}: DashboardProps) {
  const t = translations[language];

  // 1. Calculations
  const totalMembers = members.length;
  
  const expectedMonthlySavings = members.reduce((sum, m) => sum + m.monthlyDeposit, 0);

  const totalSavingsReceived = deposits
    .filter(d => d.status === 'Paid')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalLoansDisbursed = loans.reduce((sum, l) => sum + l.principal, 0);

  let totalPrincipalPaidBack = 0;
  let totalInterestEarned = 0;
  let currentMonthInterest = 0;

  loans.forEach(loan => {
    loan.emis.forEach(emi => {
      if (emi.status === 'Paid') {
        totalPrincipalPaidBack += emi.principalComponent;
        totalInterestEarned += emi.interestComponent;
        if (emi.monthKey === selectedMonth) {
          currentMonthInterest += emi.interestComponent;
        }
      }
    });
  });

  const totalOutstandingLoan = Math.max(0, totalLoansDisbursed - totalPrincipalPaidBack);
  const availableFund = Math.max(0, totalSavingsReceived + totalInterestEarned + totalPrincipalPaidBack - totalLoansDisbursed);

  const currentMonthDeposits = deposits.filter(d => d.monthKey === selectedMonth && d.status === 'Paid');
  
  const paidMembersCount = currentMonthDeposits.length;
  const pendingMembersCount = totalMembers - paidMembersCount;
  const collectionPercentage = totalMembers > 0 ? Math.round((paidMembersCount / totalMembers) * 100) : 0;

  const handlePrevMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    month--;
    if (month < 1) { month = 12; year--; }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    month++;
    if (month > 12) { month = 1; year++; }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-5 max-w-lg mx-auto pb-6">


      {/* 2. Dashboard Header */}
      <div className="flex items-center justify-between pt-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-[#5A0000] uppercase font-display tracking-wide">Dashboard</h2>
          <p className="text-[11px] text-gray-500 font-medium">Overall committee status at a glance</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#5A0000]/5 text-[#5A0000] rounded-lg text-[10px] font-bold uppercase tracking-wider">
          <LineChart className="w-3.5 h-3.5" />
          Overview
        </button>
      </div>

      {/* 3. Stats Grid (2 Columns) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Expected Monthly Card */}
        <div className="bg-[#FFF8F8] rounded-[20px] p-4 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#5A0000]/5">
          <Calendar className="absolute -bottom-2 -right-2 w-16 h-16 text-[#5A0000]/5 pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-[#5A0000]/10 flex items-center justify-center text-[#5A0000] mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-0.5">Expected Monthly</p>
          <h3 className="text-xl font-bold text-gray-900 font-serif">₹{expectedMonthlySavings.toLocaleString('en-IN')}</h3>
          <p className="text-[10px] text-gray-400 mt-1">Per Month</p>
        </div>

        {/* Expected Savings Card */}
        <div className="bg-[#FFFBF2] rounded-[20px] p-4 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#D4AF37]/10">
          <TrendingUp className="absolute -bottom-2 -right-2 w-16 h-16 text-[#D4AF37]/10 pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] mb-3">
            <TrendingUp className="w-5 h-5 text-yellow-700" />
          </div>
          <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-0.5">Total Deposit</p>
          <h3 className="text-xl font-bold text-gray-900 font-serif">₹{totalSavingsReceived.toLocaleString('en-IN')}</h3>
        </div>

        {/* Available Fund Card */}
        <div className="bg-[#F2FCF5] rounded-[20px] p-4 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-green-600/10">
          <DollarSign className="absolute -bottom-2 -right-2 w-16 h-16 text-green-600/5 pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center text-green-700 mb-3">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-0.5">{t.availableFund}</p>
          <h3 className="text-xl font-bold text-green-800 font-serif">₹{availableFund.toLocaleString('en-IN')}</h3>
          <p className="text-[10px] text-gray-400 mt-1">Total Available</p>
        </div>

        {/* Outstanding Loan Card */}
        <div className="bg-[#FFF0F0] rounded-[20px] p-4 relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-red-600/10">
          <BarChart3 className="absolute -bottom-2 -right-2 w-16 h-16 text-red-600/5 pointer-events-none" />
          <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-700 mb-3">
            <Landmark className="w-5 h-5" />
          </div>
          <p className="text-[9px] uppercase font-bold tracking-wider text-gray-500 mb-0.5">Outstanding Loan</p>
          <h3 className="text-xl font-bold text-red-800 font-serif">₹{totalOutstandingLoan.toLocaleString('en-IN')}</h3>
          <p className="text-[10px] text-gray-400 mt-1">Total Outstanding</p>
        </div>
      </div>

      {/* 4. Full Width Interest Card */}
      <div className="bg-[#F8F5FF] rounded-[20px] p-5 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-purple-600/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-purple-900 mb-0.5">Total Interest</p>
            <h3 className="text-2xl font-bold text-purple-950 font-serif">₹{totalInterestEarned.toLocaleString('en-IN')}</h3>
            <p className="text-[10px] text-purple-600/60 mt-0.5">Overall Earned</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-700">
          <LineChart className="w-5 h-5" />
        </div>
      </div>

      {/* 5. Deposit Status Card */}
      <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000]">
            {formatMonthLabel(selectedMonth, 'en')} – Deposit Status
          </h3>
          <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {paidMembersCount} / {totalMembers} PAID
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#F5F3ED] rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-[#5A0000] rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${collectionPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium">
          <span className="text-gray-500">{collectionPercentage}% Deposits Collected</span>
          <span className="text-red-500 font-bold">{pendingMembersCount} Pending</span>
        </div>
      </div>

      {/* 6. Recent Members Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">Recent Members</h3>
          <button className="text-[10px] font-bold text-[#5A0000] uppercase tracking-wider flex items-center gap-1 hover:underline">
            View All <ChevronRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {members.slice(0, 5).map(member => {
            const isPaid = deposits.some(d => d.memberId === member.id && d.monthKey === selectedMonth && d.status === 'Paid');
            
            return (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5A0000]/5 flex items-center justify-center text-[#5A0000] shrink-0 border border-[#5A0000]/10">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-tight cursor-pointer hover:underline" onClick={() => onNavigateToMember(member.id)}>
                      {member.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Deposit Amount</p>
                    <p className="text-[11px] font-bold text-green-700 font-mono tracking-tight mt-0.5">
                      ₹{member.monthlyDeposit.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                
                {isPaid ? (
                  <button
                    onClick={() => onUndoDeposit(member.id)}
                    className="text-[10px] font-bold px-4 py-2 border border-gray-200 text-gray-400 rounded-lg uppercase tracking-wider hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    Paid
                  </button>
                ) : (
                  <button
                    onClick={() => onRecordDeposit(member.id, member.monthlyDeposit, todayStr)}
                    className="text-[10px] font-bold px-4 py-2 bg-[#5A0000] text-white hover:bg-[#4a0404] transition-colors rounded-lg uppercase tracking-wider shadow-[0_2px_8px_rgba(90,0,0,0.2)]"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
