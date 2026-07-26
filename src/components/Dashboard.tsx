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
  ChevronRight as ChevronRightIcon,
  UserPlus,
  Download,
  FileText,
  ArrowRightLeft,
  FileSpreadsheet,
  Edit2
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

  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const handlePrevCard = () => {
    setActiveCardIndex((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const handleNextCard = () => {
    setActiveCardIndex((prev) => (prev === 3 ? 0 : prev + 1));
  };

  const dashboardCards = [
    {
      id: 0,
      title: 'MONTHLY COLLECTION',
      amount: expectedMonthlySavings,
      subtitle: 'Per Month',
      icon: Calendar,
      bgClass: 'bg-[#FFF3F3] border-[#5A0000]/10',
      textClass: 'text-[#5A0000]',
      amountClass: 'text-[#4A0404]',
      iconBg: 'bg-[#5A0000]/10',
      Watermark: Calendar,
      cardNumber: '**** **** **** 1001'
    },
    {
      id: 1,
      title: 'TOTAL DEPOSIT',
      amount: totalSavingsReceived,
      subtitle: 'Overall Deposited',
      icon: TrendingUp,
      bgClass: 'bg-[#FFFBF2] border-[#D4AF37]/10',
      textClass: 'text-[#D4AF37]',
      amountClass: 'text-[#856611]',
      iconBg: 'bg-[#D4AF37]/20',
      Watermark: TrendingUp,
      cardNumber: '**** **** **** 1002'
    },
    {
      id: 2,
      title: 'AVAILABLE BALANCE',
      amount: availableFund,
      subtitle: 'Total Available',
      icon: PiggyBank,
      bgClass: 'bg-[#F2FCF5] border-green-600/10',
      textClass: 'text-green-700',
      amountClass: 'text-green-900',
      iconBg: 'bg-green-600/10',
      Watermark: PiggyBank,
      cardNumber: '**** **** **** 1003'
    },
    {
      id: 3,
      title: 'OUTSTANDING LOAN',
      amount: totalOutstandingLoan,
      subtitle: 'Total Outstanding',
      icon: Landmark,
      bgClass: 'bg-[#FFF0F0] border-red-600/10',
      textClass: 'text-red-700',
      amountClass: 'text-red-900',
      iconBg: 'bg-red-600/10',
      Watermark: Landmark,
      cardNumber: '**** **** **** 1004'
    }
  ];

  return (
    <div className="space-y-5 w-full max-w-full mx-auto pb-6">


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

      {/* 3. Premium Card Slider */}
      <div className="relative w-full flex flex-col items-center justify-center my-6">
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrevCard} 
          className="absolute left-0 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-800 hover:scale-110 transition-transform -ml-2 md:-ml-4 border border-gray-100"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        {/* Cards Container */}
        <div className="w-[92%] max-w-[400px] overflow-hidden relative rounded-[24px]">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeCardIndex * 100}%)` }}
          >
            {dashboardCards.map((card, idx) => {
              const Icon = card.icon;
              const Watermark = card.Watermark;
              const isActive = activeCardIndex === idx;

              return (
                <div key={card.id} className="w-full shrink-0 flex justify-center py-2">
                  <div 
                    className={`w-full aspect-[1.7/1] min-h-[190px] rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative overflow-hidden border transition-all duration-500 ease-out ${card.bgClass} ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}
                  >
                    {/* Glassmorphism subtle overlay */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
                    
                    {/* Watermark Icon */}
                    <Watermark className="absolute -bottom-6 -right-6 w-40 h-40 opacity-[0.04] text-black pointer-events-none -rotate-12" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Top Row: Icon */}
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center text-[#5A0000]`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {/* Optional debit card chip or logo could go here */}
                      </div>

                      {/* Middle Row: Content */}
                      <div className="mt-4">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-600/80 mb-1">
                          {card.title}
                        </p>
                        <h3 className={`text-3xl md:text-4xl font-bold font-serif ${card.amountClass} tracking-tight`}>
                          ₹{card.amount.toLocaleString('en-IN')}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Bottom Row: Card Number */}
                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-mono font-semibold text-gray-600/60 tracking-widest">
                          {card.cardNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handleNextCard} 
          className="absolute right-0 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center text-gray-800 hover:scale-110 transition-transform -mr-2 md:-mr-4 border border-gray-100"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 -mt-2 mb-6">
        {dashboardCards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCardIndex(idx)}
            className={`transition-colors duration-300 rounded-full w-1.5 h-1.5 ${
              activeCardIndex === idx 
                ? 'bg-[#5A0000]' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
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

      {/* QUICK ACTIONS */}
      <div className="pt-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000] px-1 mb-3">Quick Actions</h3>
        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar px-1">
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Add Member</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <Download className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Add Deposit</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <FileText className="w-6 h-6 text-red-600 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Add Loan</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <ArrowRightLeft className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Transactions</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <FileText className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Statement</span>
          </button>
          <button className="flex flex-col items-center justify-center bg-white p-3 rounded-[16px] min-w-[76px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 shrink-0">
            <Edit2 className="w-6 h-6 text-purple-700 mb-2" />
            <span className="text-[9px] font-bold text-gray-800">Edit Details</span>
          </button>
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

      {/* 6. Recent Transactions Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000]">Recent Transactions</h3>
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
