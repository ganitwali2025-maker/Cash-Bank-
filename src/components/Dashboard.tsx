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
  ShieldCheck,
  Bell,
  Clock,
  Flame,
  IndianRupee,
  X,
  Check,
  CreditCard,
  Eye
} from 'lucide-react';
import { Member, Deposit, Loan, Emi, LanguageType } from '../types';
import { translations } from '../translations';
import { formatMonthLabel } from './Header';
import { saveDepositToSheet } from '../utils/googleSheet';

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

  const SHEET_URL =
    'https://script.google.com/macros/s/AKfycbylJG300iJuV4Ue7qSPFFJOeP8V9n6gO2ZWihN69zwmoTsHwUTNHArSwrUfrV7H-j2aTA/exec';

  const [sheetDeposits, setSheetDeposits] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${SHEET_URL}?action=getDeposits`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.data)) {
          setSheetDeposits(data.data);
        }
      })
      .catch(err => console.error('Sheet fetch error on dashboard:', err));
  }, []);

  // Compute live current month & total deposit
  const now = new Date();
  const currentMonthName = now.toLocaleDateString('en-US', { month: 'long' }); // "September"
  const currentYearStr = String(now.getFullYear()); // "2026"
  const currentMonthLabel = `${currentMonthName} ${currentYearStr}`; // "September 2026"

  const currentMonthSheetDeposits = sheetDeposits.filter(d => {
    if (!d) return false;
    const mStr = String(d.month || '').toLowerCase();
    const dStr = String(d.date || '').toLowerCase();
    if (mStr.includes(currentMonthName.toLowerCase())) return true;
    const mDate = new Date(d.month || d.date);
    if (!isNaN(mDate.getTime())) {
      return mDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase() === currentMonthName.toLowerCase();
    }
    return false;
  });

  const liveCurrentMonthCollection = sheetDeposits.length > 0
    ? currentMonthSheetDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0)
    : deposits.filter(d => d.monthKey === selectedMonth && d.status === 'Paid').reduce((sum, d) => sum + d.amount, 0);

  const liveTotalDeposit = sheetDeposits.length > 0
    ? sheetDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0)
    : totalSavingsReceived;

  const liveAvailableFund = Math.max(0, liveTotalDeposit + totalInterestEarned + totalPrincipalPaidBack - totalLoansDisbursed);

  // Members pending for current month (September 2026)
  const pendingMembersList = members.filter(m => {
    const mNum = String(m.id).match(/(\d+)/)?.[1];
    const paidInSheet = sheetDeposits.some(d => {
      if (!d) return false;
      const dMemId = String(d.memberId || '').toUpperCase();
      const matchesId = dMemId === m.id.toUpperCase() || (mNum && (dMemId === `M00${mNum}` || dMemId === `M0${mNum}` || dMemId === `M${mNum}`));
      const matchesName = d.name && d.name.toLowerCase().trim() === m.name.toLowerCase().trim();
      if (!matchesId && !matchesName) return false;

      const mStr = String(d.month || '').toLowerCase();
      if (mStr.includes('september') || mStr.includes('sep')) return true;
      const mDate = new Date(d.month || d.date);
      if (!isNaN(mDate.getTime())) {
        return mDate.toLocaleDateString('en-US', { month: 'long' }).toLowerCase() === 'september';
      }
      return false;
    });
    return !paidInSheet;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // 15th of the month rule & Pay Modal states
  const currentDayOfMonth = now.getDate();
  const isAfter15th = currentDayOfMonth >= 15;
  const [showPendingAnyway, setShowPendingAnyway] = React.useState(false);

  const [payModalMember, setPayModalMember] = React.useState<Member | null>(null);
  const [payAmount, setPayAmount] = React.useState<number>(3000);
  const [payDate, setPayDate] = React.useState<string>(todayStr);
  const [payMode, setPayMode] = React.useState<'Cash' | 'UPI' | 'A/C Transfer'>('Cash');
  const [isSubmittingPay, setIsSubmittingPay] = React.useState(false);

  const openPayModal = (member: Member) => {
    setPayModalMember(member);
    setPayAmount(member.monthlyDeposit || 3000);
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayMode('Cash');
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalMember) return;
    setIsSubmittingPay(true);

    const mNum = String(payModalMember.id).match(/(\d+)/)?.[1];
    const formattedMemId = mNum ? `MB-${String(mNum).padStart(3, '0')}` : payModalMember.id;

    // 1. Save to Google Sheet
    await saveDepositToSheet({
      action: 'addDeposit',
      memberId: formattedMemId,
      memberName: payModalMember.name,
      month: 'September 2026',
      date: payDate,
      amount: Number(payAmount),
      paymentMode: payMode,
      depositType: 'Saving Account',
      remark: 'Direct Pay from Dashboard Alert',
      status: 'Paid'
    });

    // 2. Local app update
    onRecordDeposit(payModalMember.id, Number(payAmount), payDate, selectedMonth);

    // 3. Update local sheet list so member immediately leaves pending list
    setSheetDeposits(prev => [
      ...prev,
      {
        memberId: formattedMemId,
        name: payModalMember.name,
        month: 'September 2026',
        date: payDate,
        amount: Number(payAmount),
        paymentMode: payMode,
        status: 'Paid'
      }
    ]);

    setIsSubmittingPay(false);
    setPayModalMember(null);
  };

  const [activeCardIndex, setActiveCardIndex] = React.useState(0);
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);
  const [touchEndX, setTouchEndX] = React.useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = React.useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 35) {
      setActiveCardIndex((prev) => (prev < 4 ? prev + 1 : 0));
    } else if (diff < -35) {
      setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : 4));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;
    const diff = mouseStartX - e.clientX;
    if (diff > 35) {
      setActiveCardIndex((prev) => (prev < 4 ? prev + 1 : 0));
    } else if (diff < -35) {
      setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : 4));
    }
    setMouseStartX(null);
  };

  const dashboardCards = [
    {
      id: 0,
      title: `${currentMonthName.toUpperCase()} COLLECTION`,
      amount: liveCurrentMonthCollection,
      subtitle: `Current Month (${currentMonthLabel}) • Live`,
      icon: Calendar,
      bgClass: 'bg-gradient-to-br from-[#800000] to-[#4a0000]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: Calendar,
      cardNumber: '**** **** **** 1001',
      stats: [
        { label: 'Total Members', value: totalMembers, icon: Users },
        { label: 'Live Records', value: currentMonthSheetDeposits.length || paidMembersCount, icon: Wallet },
        { label: 'Month', value: currentMonthLabel, icon: History }
      ]
    },
    {
      id: 1,
      title: 'TOTAL DEPOSIT',
      amount: liveTotalDeposit,
      subtitle: `Overall Deposited in Sheet (${sheetDeposits.length || deposits.length} records)`,
      icon: TrendingUp,
      bgClass: 'bg-gradient-to-br from-[#800000] to-[#4a0000]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: TrendingUp,
      cardNumber: '**** **** **** 1002',
      stats: [
        { label: 'This Month', value: `₹${liveCurrentMonthCollection.toLocaleString('en-IN')}`, icon: Calendar },
        { label: 'Total Records', value: sheetDeposits.length || paidMembersCount, icon: Users },
        { label: 'Sheet Sync', value: 'Live', icon: Percent }
      ]
    },
    {
      id: 2,
      title: 'AVAILABLE BALANCE',
      amount: liveAvailableFund,
      subtitle: 'Total Cash on Hand (Live)',
      icon: PiggyBank,
      bgClass: 'bg-gradient-to-br from-[#800000] to-[#4a0000]',
      amountClass: 'text-[#E8C34D]',
      iconBg: 'bg-[#C78726]/40',
      Watermark: PiggyBank,
      cardNumber: '**** **** **** 1003',
      stats: [
        { label: 'Total Savings', value: `₹${liveTotalDeposit.toLocaleString('en-IN')}`, icon: Wallet },
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
      bgClass: 'bg-gradient-to-br from-[#800000] to-[#4a0000]',
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
      bgClass: 'bg-gradient-to-br from-[#800000] to-[#4a0000]',
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
        {/* Cards Container */}
        <div 
          className="w-[95%] max-w-[550px] overflow-hidden relative rounded-[24px] md:rounded-[32px] cursor-grab active:cursor-grabbing select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={(e) => {
            // Only trigger click if not swiping
            if (touchStartX === null && mouseStartX === null) {
              setActiveCardIndex((prev) => (prev === 4 ? 0 : prev + 1));
            }
          }}
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
                    className={`w-full aspect-auto md:aspect-[1.6/1] min-h-[220px] rounded-[24px] md:rounded-[32px] p-6 shadow-[0_10px_30px_rgba(90,0,0,0.4)] relative overflow-hidden border-[3px] border-[#D4AF37] transition-all duration-500 ease-out ${card.bgClass} ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}`}
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

                        {/* +12% Pill */}
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

        {/* 5 Small Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5 mb-1">
          {dashboardCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCardIndex(idx)}
              className={`h-1.5 min-h-[6px] max-h-[6px] rounded-full transition-all duration-300 p-0 border-0 outline-none cursor-pointer ${
                activeCardIndex === idx
                  ? 'w-5 min-w-[20px] bg-[#4a0404]'
                  : 'w-1.5 min-w-[6px] max-w-[6px] bg-[#4a0404]/30 hover:bg-[#4a0404]/60'
              }`}
              title={`Card ${idx + 1}`}
            />
          ))}
        </div>
      </div>


      {/* QUICK ACTIONS */}
      <div className="pt-2">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000] px-1 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 sm:gap-3 px-1">
          {[
            { icon: <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mb-1.5" />, label: 'Add Member', route: '/members' },
            { icon: <Download className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mb-1.5" />, label: 'Deposit', route: '/deposit' },
            { icon: <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mb-1.5" />, label: 'Withdraw', route: '/withdraw' },
            { icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mb-1.5" />, label: 'Loan', route: '/loans' },
            { icon: <Book className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mb-1.5" />, label: 'Passbook', route: '/members' },
            { icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 mb-1.5" />, label: 'Statement', route: '/reports' },
            { icon: <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mb-1.5" />, label: 'Reports', route: '/reports' },
            { icon: <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 mb-1.5" />, label: 'Transactions', route: '/transactions' },
            { icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mb-1.5" />, label: 'EMI Collection', route: '/emis' },
            { icon: <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mb-1.5" />, label: 'More', route: '/more' },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => action.route && navigate(action.route)}
              className="flex flex-col items-center justify-center bg-white py-3 px-1 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {action.icon}
              <span className="text-[9px] font-bold text-gray-800 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PENDING DEPOSITS NOTIFICATION ALERT (Activates after 15th of month) */}
      <div className="mt-4 pt-2">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <Bell size={18} className="text-[#D97706] animate-bounce" fill="#D97706" fillOpacity={0.2} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000]">
              Pending Deposit Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isAfter15th && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Active After 15th
              </span>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {pendingMembersList.length} Pending
            </span>
          </div>
        </div>

        {!isAfter15th && !showPendingAnyway ? (
          <div className="bg-amber-50/90 border border-amber-200/90 rounded-[20px] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-amber-900">
                📅 Har mahine 15 tarik ke baad pending list yahan automatic dikhegi.
              </p>
              <p className="text-[10px] text-amber-700 font-medium mt-0.5">
                Current Date: {currentDayOfMonth} Sep (15th se pehle regular deposit time active hai)
              </p>
            </div>
            <button
              onClick={() => setShowPendingAnyway(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl text-[10px] font-bold shadow hover:bg-amber-700 transition-all shrink-0 cursor-pointer"
            >
              <Eye size={12} />
              View Pending List ({pendingMembersList.length})
            </button>
          </div>
        ) : pendingMembersList.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-[20px] p-4 text-center">
            <p className="text-xs font-bold text-green-700">🎉 Saare members ka September deposit receive ho gaya hai!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingMembersList.map(member => (
              <div 
                key={member.id}
                className="bg-white rounded-[20px] p-3.5 border border-amber-200/80 shadow-[0_4px_15px_rgba(217,119,6,0.06)] flex items-center justify-between hover:shadow-md transition-all"
              >
                {/* Member Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#5A0000] font-black text-sm shrink-0">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 leading-tight uppercase">{member.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        September 2026
                      </span>
                      <span className="text-[9px] font-bold text-gray-500">
                        ID: {member.id.replace('member-', 'MB-')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Direct Pay Action Button */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-black text-[#5A0000]">₹{member.monthlyDeposit}</p>
                    <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                      Pending
                    </span>
                  </div>
                  <button 
                    onClick={() => openPayModal(member)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5A0000] to-[#800000] text-[#D4AF37] text-[10px] font-black tracking-wider uppercase shadow hover:brightness-110 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    PAY
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DIRECT PAY MODAL POPUP */}
      {payModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200/50 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#5A0000]/10 flex items-center justify-center text-[#5A0000]">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#5A0000] uppercase">Pay Deposit</h3>
                  <p className="text-[11px] font-bold text-gray-700">{payModalMember.name} • <span className="text-amber-700">September 2026</span></p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setPayModalMember(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePaySubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Deposit Amount (₹)
                </label>
                <input 
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#5A0000]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Payment Date
                </label>
                <input 
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#5A0000]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Payment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Cash', 'UPI', 'A/C Transfer'] as const).map(mode => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setPayMode(mode)}
                      className={`py-2 px-1 text-center rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                        payMode === mode
                          ? 'bg-[#5A0000] text-[#D4AF37] border-[#5A0000] shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons: SUBMIT & CANCEL */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPayModalMember(null)}
                  className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="w-full py-2.5 rounded-xl bg-[#5A0000] text-[#D4AF37] font-black text-xs shadow-md hover:bg-[#4a0404] transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingPay ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Check size={14} />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation and scroll space */}
      <div className="h-48 w-full"></div>

    </div>
  );
}
