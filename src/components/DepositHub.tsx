import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  Calendar, 
  Hourglass, 
  PlusCircle, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { Member, Deposit, LanguageType } from '../types';
import { formatMonthLabel } from './Header';

interface DepositHubProps {
  members: Member[];
  deposits: Deposit[];
  selectedMonth: string;
  language: LanguageType;
}

const DepositHub: React.FC<DepositHubProps> = ({ members, deposits, selectedMonth, language }) => {
  const navigate = useNavigate();

  // Calculations
  const totalDeposit = deposits
    .filter(d => d.status === 'Paid')
    .reduce((sum, d) => sum + d.amount, 0);

  const currentMonthDeposits = deposits
    .filter(d => d.monthKey === selectedMonth && d.status === 'Paid')
    .reduce((sum, d) => sum + d.amount, 0);

  const expectedThisMonth = members.reduce((sum, m) => sum + m.monthlyDeposit, 0);
  const dueThisMonth = expectedThisMonth - currentMonthDeposits;

  const displayMonth = formatMonthLabel(selectedMonth, language);

  return (
    <div className="font-sans text-[#111827] space-y-6 pb-24 max-w-3xl mx-auto w-full animate-fade-in-up">
      
      {/* Header Area */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-[#F0FDF4] rounded-full text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
        >
          <ArrowLeft size={20} className="stroke-[2.5px]" />
        </button>
        <h1 className="text-2xl font-bold font-sans">Deposit</h1>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-white to-[#F0FDF4] p-5 sm:p-6 rounded-[24px] border border-[#E5E7EB] soft-shadow-lg glass-card flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 gap-4 md:gap-0">
        
        {/* Section 1: Total Deposit */}
        <div className="flex-1 flex items-center gap-4 py-2 md:py-0 md:px-4 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Total Deposit</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#16A34A] leading-tight">₹ {totalDeposit.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">All Time Total</p>
          </div>
        </div>

        {/* Section 2: Monthly Deposit */}
        <div className="flex-1 flex items-center gap-4 py-4 md:py-0 md:px-4">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#16A34A]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Monthly Deposit</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#16A34A] leading-tight">₹ {currentMonthDeposits.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">{displayMonth}</p>
          </div>
        </div>

        {/* Section 3: Due Amount */}
        <div className="flex-1 flex items-center gap-4 py-2 md:py-0 md:px-4 last:pb-0 md:last:pr-0">
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <Hourglass className="w-6 h-6 text-[#D97706]" />
          </div>
          <div>
            <h3 className="text-[13px] font-semibold text-[#111827] mb-1">Due Amount</h3>
            <p className="text-2xl sm:text-3xl font-bold text-[#D97706] leading-tight">₹ {dueThisMonth > 0 ? dueThisMonth.toLocaleString('en-IN') : '0'}</p>
            <p className="text-[11px] text-[#6B7280] mt-1">Due for this month</p>
          </div>
        </div>

      </div>

      {/* Action Buttons (Row) */}
      <div className="flex flex-col sm:flex-row gap-4">
        
        {/* Left Card: Add Deposit */}
        <button 
          onClick={() => navigate('/deposit-form')}
          className="flex-1 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] p-5 rounded-[22px] border border-[#BBF7D0] soft-shadow hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-sm">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] mb-0.5 group-hover:text-[#16A34A] transition-colors">Add Deposit</h3>
              <p className="text-xs text-[#4B5563]">Click here to add new deposit</p>
            </div>
          </div>
          <ChevronRight className="text-[#111827] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" size={20} />
        </button>

        {/* Right Card: Data Sheet */}
        <button 
          onClick={() => navigate('/deposits')}
          className="flex-1 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] p-5 rounded-[22px] border border-[#BFDBFE] soft-shadow hover:shadow-md hover:scale-[1.01] transition-all flex items-center justify-between group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white shrink-0 shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827] mb-0.5 group-hover:text-[#2563EB] transition-colors">Data Sheet</h3>
              <p className="text-xs text-[#4B5563]">Click here to view deposit data</p>
            </div>
          </div>
          <ChevronRight className="text-[#111827] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" size={20} />
        </button>

      </div>

    </div>
  );
};

export default DepositHub;
