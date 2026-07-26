import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  LayoutGrid,
  Wallet,
  History,
  ShieldCheck
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
  const navigate = useNavigate();
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
      setActiveCardIndex((prev) => (prev === 4 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const dashboardCards = [
    {
      id: 0,
      title: 'MONTHLY COLLECTION',
      amount: expectedMonthlySavings,
      subtitle: 'Regular monthly savings',
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-[#5E1A1A] to-[#401212]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: Calendar,
      cardNumber: '**** **** **** 1001',
      stats: [
        { label: 'Total Members', value: totalMembers, icon: Users },
        { label: 'Total Collected', value: `₹${totalSavingsReceived.toLocaleString('en-IN')}`, icon: Wallet },
        { label: 'Next Collection', value: '05 Aug 2025', icon: History }
      ]
    },
    {
      id: 1,
      title: 'TOTAL DEPOSIT',
      amount: totalSavingsReceived,
      subtitle: 'Overall Deposited Amount',
      icon: TrendingUp,
      bgClass: 'bg-gradient-to-br from-[#5E1A1A] to-[#401212]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: TrendingUp,
      cardNumber: '**** **** **** 1002',
      stats: [
        { label: 'This Month', value: `₹${currentMonthDeposits.reduce((a, b) => a + b.amount, 0).toLocaleString('en-IN')}`, icon: Calendar },
        { label: 'Members Paid', value: paidMembersCount, icon: Users },
        { label: 'Collection Rate', value: `${collectionPercentage}%`, icon: Percent }
      ]
    },
    {
      id: 2,
      title: 'AVAILABLE BALANCE',
      amount: availableFund,
      subtitle: 'Total Cash on Hand',
      icon: PiggyBank,
      bgClass: 'bg-gradient-to-br from-[#5E1A1A] to-[#401212]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: PiggyBank,
      cardNumber: '**** **** **** 1003',
      stats: [
        { label: 'Total Savings', value: `₹${totalSavingsReceived.toLocaleString('en-IN')}`, icon: Wallet },
        { label: 'Interest Earned', value: `₹${totalInterestEarned.toLocaleString('en-IN')}`, icon: TrendingUp },
        { label: 'Loans Given', value: `₹${totalLoansDisbursed.toLocaleString('en-IN')}`, icon: Landmark }
      ]
    },
    {
      id: 3,
      title: 'OUTSTANDING LOAN',
      amount: totalOutstandingLoan,
      subtitle: 'Total Amount to be recovered',
      icon: Landmark,
      bgClass: 'bg-gradient-to-br from-[#5E1A1A] to-[#401212]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: Landmark,
      cardNumber: '**** **** **** 1004',
      stats: [
        { label: 'Total Principal', value: `₹${totalLoansDisbursed.toLocaleString('en-IN')}`, icon: Wallet },
        { label: 'Principal Paid', value: `₹${totalPrincipalPaidBack.toLocaleString('en-IN')}`, icon: History },
        { label: 'Active Loans', value: loans.filter(l => l.status === 'Active').length, icon: Users }
      ]
    },
    {
      id: 4,
      title: 'TOTAL INTEREST',
      amount: totalInterestEarned,
      subtitle: 'Overall Interest Earned',
      icon: LineChart,
      bgClass: 'bg-gradient-to-br from-[#5E1A1A] to-[#401212]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: LineChart,
      cardNumber: '**** **** **** 1005',
      stats: [
        { label: 'This Month', value: `₹${currentMonthInterest.toLocaleString('en-IN')}`, icon: Calendar },
        { label: 'Total Principal', value: `₹${totalPrincipalPaidBack.toLocaleString('en-IN')}`, icon: Wallet },
        { label: 'Expected Total', value: `₹${loans.reduce((sum, l) => sum + l.emis.reduce((s, e) => s + e.interestComponent, 0), 0).toLocaleString('en-IN')}`, icon: TrendingUp }
      ]
    }
  ];

  return (
    <div className="space-y-5 w-full max-w-full mx-auto pb-6">


      {/* 2. Dashboard Header Removed */}

      {/* 3. Premium Card Slider */}
      <div className="relative w-full flex flex-col items-center justify-center my-6">
        {/* Navigation Arrows Removed */}
        
        {/* Cards Container */}
        <div 
          className="w-[95%] max-w-[550px] overflow-hidden relative rounded-[24px] md:rounded-[32px] cursor-pointer"
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
                    className={`w-full aspect-auto md:aspect-[1.6/1] min-h-[220px] rounded-[24px] md:rounded-[32px] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.15)] relative overflow-hidden border border-[#D4AF37]/10 transition-all duration-500 ease-out ${card.bgClass} ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}
                  >
                    {/* Background noise/dots overlay */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                    
                    {/* Watermark Icon */}
                    <Watermark className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.03] text-white pointer-events-none -rotate-12" />

                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Top Row: Icon, Title & Pill */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-[#E8C34D] shadow-inner ${card.iconBg} border border-[#E8C34D]/20`}>
                            <Icon className="w-6 h-6 md:w-7 md:h-7" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-sm md:text-base font-bold text-white tracking-widest">{card.title}</h3>
                            <p className="text-xs md:text-sm text-white/60 font-medium">{card.subtitle}</p>
                          </div>
                        </div>

                        {/* +12% Pill (hidden on very small screens for space) */}
                        <div className="hidden sm:flex flex-col items-end bg-[#EAF5E5] px-3 py-1.5 rounded-lg border border-green-200 shadow-sm ml-2">
                          <div className="flex items-center gap-1 text-green-700 font-bold text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12%</span>
                          </div>
                          <p className="text-[9px] text-green-600/80 font-medium whitespace-nowrap">vs last month</p>
                        </div>
                      </div>

                      {/* Middle Row: Amount */}
                      <div className="mt-8 mb-6 text-white">
                        <h2 className={`text-5xl md:text-6xl font-black font-sans ${card.amountClass} tracking-tight drop-shadow-md`}>
                          ₹{card.amount.toLocaleString('en-IN')}
                        </h2>
                        <p className="text-sm md:text-base text-white/90 font-bold mt-1">
                          Per Month
                        </p>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between mb-5 w-full overflow-x-auto no-scrollbar">
                        {card.stats.map((stat, i) => (
                          <React.Fragment key={i}>
                            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[#E8C34D]">
                                <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] md:text-[10px] text-white/60 uppercase font-medium">{stat.label}</span>
                                <span className="text-xs md:text-sm text-white font-bold">{stat.value}</span>
                              </div>
                            </div>
                            {i < card.stats.length - 1 && <div className="w-[1px] h-8 md:h-10 bg-white/10 mx-2 md:mx-4 shrink-0"></div>}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Bottom Footer: Chip & Card Number */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-7 border border-[#E8C34D]/40 rounded bg-gradient-to-br from-[#D4AF37]/30 to-[#A57C1B]/10 flex items-center justify-center relative overflow-hidden shadow-sm">
                           <div className="w-full h-[1px] bg-[#E8C34D]/30 absolute top-1/2"></div>
                           <div className="w-[1px] h-full bg-[#E8C34D]/30 absolute left-1/3"></div>
                           <div className="w-[1px] h-full bg-[#E8C34D]/30 absolute right-1/3"></div>
                        </div>
                        <p className="text-sm md:text-base font-mono font-bold text-white/70 tracking-widest">
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

      {/* Spacer for bottom navigation and scroll space */}
      <div className="h-48 w-full"></div>

    </div>
  );
}
