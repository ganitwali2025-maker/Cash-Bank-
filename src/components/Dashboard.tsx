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
  Edit2,
  AlertTriangle,
  Upload,
  ArrowUpRight,
  Briefcase,
  PieChart,
  Book,
  QrCode,
  Percent,
  LayoutGrid
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
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev === 3 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const dashboardCards = [
    {
      id: 0,
      title: 'MONTHLY COLLECTION',
      amount: expectedMonthlySavings,
      subtitle: 'Per Month',
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-[#7a0505] to-[#4a0000] border-[#3a0000]',
      amountClass: 'text-[#D4AF37]',
      iconBg: 'bg-[#D4AF37]/20',
      Watermark: Calendar,
      cardNumber: '**** **** **** 1001'
    },
    {
      id: 1,
      title: 'TOTAL DEPOSIT',
      amount: totalSavingsReceived,
      subtitle: 'Overall Deposited',
      icon: TrendingUp,
      bgClass: 'bg-gradient-to-br from-[#7a0505] to-[#4a0000] border-[#3a0000]',
      amountClass: 'text-[#D4AF37]',
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
      bgClass: 'bg-gradient-to-br from-[#7a0505] to-[#4a0000] border-[#3a0000]',
      amountClass: 'text-[#D4AF37]',
      iconBg: 'bg-[#D4AF37]/20',
      Watermark: PiggyBank,
      cardNumber: '**** **** **** 1003'
    },
    {
      id: 3,
      title: 'OUTSTANDING LOAN',
      amount: totalOutstandingLoan,
      subtitle: 'Total Outstanding',
      icon: Landmark,
      bgClass: 'bg-gradient-to-br from-[#7a0505] to-[#4a0000] border-[#3a0000]',
      amountClass: 'text-[#D4AF37]',
      iconBg: 'bg-[#D4AF37]/20',
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
        {/* Navigation Arrows Removed */}
        
        {/* Cards Container */}
        <div 
          className="w-[92%] max-w-[400px] overflow-hidden relative rounded-[24px] cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onClick={() => setActiveCardIndex((prev) => (prev === 3 ? 0 : prev + 1))}
        >
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
                        <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center text-[#D4AF37]`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        {/* Fake Credit Card Chip */}
                        <div className="w-10 h-8 bg-gradient-to-br from-[#E8C34D] to-[#D4AF37] rounded-md shadow-sm border border-[#c5a059]/50 flex items-center justify-center relative overflow-hidden">
                          <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
                          <div className="w-[1px] h-full bg-black/20 absolute left-1/3"></div>
                          <div className="w-[1px] h-full bg-black/20 absolute right-1/3"></div>
                        </div>
                      </div>

                      {/* Middle Row: Content */}
                      <div className="mt-4 text-white">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-white/80 mb-1">
                          {card.title}
                        </p>
                        <h3 className={`text-3xl md:text-4xl font-bold font-serif ${card.amountClass} tracking-tight`}>
                          ₹{card.amount.toLocaleString('en-IN')}
                        </h3>
                        <p className="text-xs text-white/80 font-medium mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Bottom Row: Card Number */}
                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-mono font-bold text-white/70 tracking-widest">
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
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 px-1">
          {[
            { icon: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-1.5" />, label: 'Add Member' },
            { icon: <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mb-1.5" />, label: 'Deposit' },
            { icon: <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-1.5" />, label: 'Withdraw' },
            { icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mb-1.5" />, label: 'EMI Collection' },
            { icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-1.5" />, label: 'Loan' },
            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 mb-1.5" />, label: 'Statement' },
            { icon: <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mb-1.5" />, label: 'Reports' },
            { icon: <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mb-1.5" />, label: 'Transactions' },
            { icon: <Book className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mb-1.5" />, label: 'Passbook' },
            { icon: <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 mb-1.5" />, label: 'QR Payment' },
            { icon: <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 mb-1.5" />, label: 'Interest' },
            { icon: <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-1.5" />, label: 'More' },
          ].map((action, i) => (
            <button key={i} className="flex flex-col items-center justify-center bg-white py-3 px-1 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 transition-colors">
              {action.icon}
              <span className="text-[9px] font-bold text-gray-800 text-center leading-tight">{action.label}</span>
            </button>
          ))}
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
