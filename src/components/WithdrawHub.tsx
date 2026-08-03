import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  ArrowUpRight, 
  CreditCard,
  PlusCircle, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Member, Deposit, LanguageType } from '../types';
import { formatMonthLabel } from './Header';

interface WithdrawHubProps {
  members: Member[];
  deposits: Deposit[]; // Note: If you add withdrawals to state later, pass them here
  selectedMonth: string;
  language: LanguageType;
}

const WithdrawHub: React.FC<WithdrawHubProps> = ({ members, deposits, selectedMonth, language }) => {
  const navigate = useNavigate();

  // Calculations (Using deposits as proxy for available balance)
  const totalDeposit = deposits
    .filter(d => d.status === 'Paid')
    .reduce((sum, d) => sum + d.amount, 0);

  // In a real app with withdrawals state, you'd calculate these dynamically.
  // For now, setting to 0 or placeholders as requested by the UI design
  const availableBalance = totalDeposit;
  const currentMonthWithdraw = 0; 
  const remainingBalance = availableBalance - currentMonthWithdraw;

  const displayMonth = formatMonthLabel(selectedMonth, language);

  return (
    <div className="font-sans text-[#111827] space-y-6 pb-24 max-w-3xl mx-auto w-full animate-fade-in-up">
      
      {/* Header Area */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[#FEF2F2] rounded-full text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
        >
          <ArrowLeft size={20} className="stroke-[2.5px]" />
        </button>
        <h1 className="text-2xl font-bold font-sans">Withdraw</h1>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-white to-[#FEF2F2] p-5 sm:p-6 rounded-[24px] border border-[#E5E7EB] soft-shadow-lg glass-card flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 gap-4 md:gap-0">
        
        {/* Section 1: Available Balance */}
        <div className="flex-1 flex items-center gap-4 py-2 md:py-0 md:px-4 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Available Balance</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#16A34A] leading-tight">₹ {availableBalance > 0 ? availableBalance.toLocaleString('en-IN') : '12,800'}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">Available Saving Balance</p>
          </div>
        </div>

        {/* Section 2: Current Month Withdraw */}
        <div className="flex-1 flex items-center gap-4 py-4 md:py-0 md:px-4">
          <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6 text-[#DC2626]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Current Month Withdraw</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#DC2626] leading-tight">₹ {currentMonthWithdraw > 0 ? currentMonthWithdraw.toLocaleString('en-IN') : '0'}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">{displayMonth}</p>
          </div>
        </div>

        {/* Section 3: Remaining Balance */}
        <div className="flex-1 flex items-center gap-4 py-2 md:py-0 md:px-4 last:pb-0 md:last:pr-0">
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 text-[#D97706]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Remaining Balance</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#D97706] leading-tight">₹ {remainingBalance > 0 ? remainingBalance.toLocaleString('en-IN') : '12,800'}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">After Withdraw</p>
          </div>
        </div>

      </div>

      {/* Action Buttons (Row) */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Left Card: Add Withdraw */}
        <button 
          onClick={() => navigate('/withdraw-form')}
          className="flex-1 bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] p-5 rounded-[22px] border border-[#FECACA] soft-shadow hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF4444] to-[#B91C1C] flex items-center justify-center text-white shrink-0 shadow-sm">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] mb-0.5 group-hover:text-[#DC2626] transition-colors">Add Withdraw</h3>
              <p className="text-xs text-[#4B5563]">Create New Withdraw Entry</p>
            </div>
          </div>
          <ChevronRight className="text-[#111827] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" size={20} />
        </button>

        {/* Right Card: Withdraw History */}
        <button 
          onClick={() => navigate('/transactions')}
          className="flex-1 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] p-5 rounded-[22px] border border-[#BFDBFE] soft-shadow hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] mb-0.5 group-hover:text-[#2563EB] transition-colors">Withdraw History</h3>
              <p className="text-xs text-[#4B5563]">View Withdraw Data Sheet</p>
            </div>
          </div>
          <ChevronRight className="text-[#111827] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" size={20} />
        </button>

      </div>

    </div>
  );
};

export default WithdrawHub;
