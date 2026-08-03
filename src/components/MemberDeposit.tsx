import React, { useState } from 'react';
import { 
  ArrowLeft, 
  History, 
  User, 
  Calendar, 
  ShieldCheck, 
  ChevronDown, 
  Banknote,
  Landmark,
  PiggyBank,
  HandCoins,
  Calculator,
  MessageSquare,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../types';

interface MemberDepositProps {
  members: Member[];
}

const MemberDeposit: React.FC<MemberDepositProps> = ({ members }) => {
  const navigate = useNavigate();
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members.length > 0 ? members[0].id : '');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'A/C Transfer'>('Cash');
  const [depositType, setDepositType] = useState<'Saving Account' | 'Loan Account'>('Saving Account');

  return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] pb-24 font-['Inter',sans-serif] text-[#111827]">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-luxury-cream)] px-4 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center hover:bg-[#DCFCE7] transition-colors"
          >
            <ArrowLeft size={20} className="stroke-[2.5px]" />
          </button>
          <h1 className="text-[22px] font-bold text-[#111827]">Add Deposit</h1>
        </div>
        <button 
          onClick={() => navigate('/deposits')}
          className="flex items-center gap-1.5 text-[#16A34A] font-semibold text-sm hover:bg-[#F0FDF4] px-3 py-1.5 rounded-full transition-colors"
        >
          <History size={16} strokeWidth={2.5} />
          Deposit History
        </button>
      </div>

      <div className="px-4 py-5 space-y-5">
        
        {/* Member Info Card */}
        <div className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col md:flex-row gap-4 md:items-center relative bg-white shadow-sm">
          {/* Left Side */}
          <div className="flex gap-4 items-start md:w-3/5">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
              <User size={32} className="text-[#15803D]" fill="currentColor" />
            </div>
            <div className="w-full">
              <p className="text-[11px] font-semibold text-[#6B7280]">Select Member</p>
              <div className="relative mb-2 mt-0.5">
                <select 
                  className="w-full text-lg font-bold text-[#111827] outline-none appearance-none bg-transparent"
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                  {members.length === 0 && <option value="">No members available</option>}
                </select>
                <ChevronDown size={18} className="text-[#6B7280] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              
              {(() => {
                const member = members.find(m => m.id === selectedMemberId);
                return member ? (
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-[#4B5563]">
                      Member ID <span className="mx-1">:</span> <span className="text-[#16A34A]">{member.id}</span>
                    </p>
                    <p className="text-xs font-semibold text-[#4B5563]">
                      Mobile No <span className="mx-1">:</span> {member.phone}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
          
          {/* Divider */}
          <div className="hidden md:block w-px h-16 bg-[#E5E7EB]"></div>
          <div className="block md:hidden h-px w-full bg-[#E5E7EB]"></div>

          {/* Right Side */}
          {(() => {
            const member = members.find(m => m.id === selectedMemberId);
            return member ? (
              <div className="space-y-3 md:w-2/5">
                <div className="flex items-start gap-2.5">
                  <Calendar size={16} className="text-[#4B5563] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-[#6B7280] leading-none mb-1">Member Since</p>
                    <p className="text-xs font-bold text-[#111827]">
                      {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-[#16A34A] mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-[#6B7280] leading-none mb-1">Membership Status</p>
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* Form Container */}
        <div className="border border-[#E5E7EB] rounded-2xl p-4 bg-white shadow-sm space-y-5">
          
          {/* Date & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111827]">Date <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus-within:border-[#16A34A] transition-colors">
                <Calendar size={18} className="text-[#4B5563]" />
                <input type="text" defaultValue="15 Aug 2026" className="w-full text-sm ml-2 font-bold text-[#111827] outline-none" />
                <Calendar size={18} className="text-[#4B5563]" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111827]">Month <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus-within:border-[#16A34A] transition-colors">
                <Calendar size={18} className="text-[#4B5563]" />
                <select className="w-full text-sm ml-2 font-bold text-[#111827] outline-none appearance-none bg-transparent">
                  <option>August 2026</option>
                  <option>September 2026</option>
                </select>
                <ChevronDown size={18} className="text-[#4B5563]" />
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111827]">Payment Mode <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setPaymentMode('Cash')}
                className={`relative flex items-center justify-center gap-2 py-3 rounded-lg border ${paymentMode === 'Cash' ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#D1D5DB]'} transition-colors`}
              >
                <Banknote size={18} className={paymentMode === 'Cash' ? 'text-[#16A34A]' : 'text-[#4B5563]'} />
                <span className={`text-sm font-bold ${paymentMode === 'Cash' ? 'text-[#111827]' : 'text-[#4B5563]'}`}>Cash</span>
                {paymentMode === 'Cash' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                    <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A] stroke-white" />
                  </div>
                )}
              </button>

              <button 
                onClick={() => setPaymentMode('UPI')}
                className={`relative flex items-center justify-center gap-2 py-3 rounded-lg border ${paymentMode === 'UPI' ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#D1D5DB]'} transition-colors`}
              >
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                </div>
                <span className={`text-sm font-bold ${paymentMode === 'UPI' ? 'text-[#111827]' : 'text-[#4B5563]'}`}>UPI</span>
                {paymentMode === 'UPI' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                    <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A] stroke-white" />
                  </div>
                )}
              </button>

              <button 
                onClick={() => setPaymentMode('A/C Transfer')}
                className={`relative flex items-center justify-center gap-2 py-3 rounded-lg border ${paymentMode === 'A/C Transfer' ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#D1D5DB]'} transition-colors`}
              >
                <Landmark size={18} className={paymentMode === 'A/C Transfer' ? 'text-[#16A34A]' : 'text-[#4B5563]'} />
                <span className={`text-sm font-bold ${paymentMode === 'A/C Transfer' ? 'text-[#111827]' : 'text-[#4B5563]'}`}>A/C Transfer</span>
                {paymentMode === 'A/C Transfer' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                    <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A] stroke-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Deposit Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#111827]">Deposit Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDepositType('Saving Account')}
                className={`relative flex items-center justify-center gap-2 py-3 rounded-lg border ${depositType === 'Saving Account' ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#D1D5DB]'} transition-colors`}
              >
                <PiggyBank size={18} className={depositType === 'Saving Account' ? 'text-[#16A34A]' : 'text-[#4B5563]'} fill={depositType === 'Saving Account' ? 'currentColor' : 'none'} />
                <span className={`text-sm font-bold ${depositType === 'Saving Account' ? 'text-[#111827]' : 'text-[#4B5563]'}`}>Saving Account</span>
                {depositType === 'Saving Account' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                    <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A] stroke-white" />
                  </div>
                )}
              </button>
              <button 
                onClick={() => setDepositType('Loan Account')}
                className={`relative flex items-center justify-center gap-2 py-3 rounded-lg border ${depositType === 'Loan Account' ? 'bg-[#F0FDF4] border-[#16A34A]' : 'bg-white border-[#D1D5DB]'} transition-colors`}
              >
                <HandCoins size={18} className={depositType === 'Loan Account' ? 'text-[#16A34A]' : 'text-[#4B5563]'} />
                <span className={`text-sm font-bold ${depositType === 'Loan Account' ? 'text-[#111827]' : 'text-[#4B5563]'}`}>Loan Account</span>
                {depositType === 'Loan Account' && (
                  <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                    <CheckCircle2 size={16} className="text-[#16A34A] fill-[#16A34A] stroke-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827]">Amount (₹) <span className="text-red-500">*</span></label>
            <div className="flex items-center border border-[#D1D5DB] rounded-lg px-3 py-3 focus-within:border-[#16A34A] focus-within:ring-1 focus-within:ring-[#16A34A] transition-all">
              <span className="text-xl font-bold text-[#4B5563]">₹</span>
              <input type="number" defaultValue="500" className="w-full text-xl ml-3 outline-none text-[#111827] font-bold" />
              <div className="pl-3 border-l border-[#D1D5DB]">
                <Calculator size={20} className="text-[#16A34A]" />
              </div>
            </div>
          </div>

          {/* Message / Remark */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827]">Message / Remark (Optional)</label>
            <div className="flex items-center border border-[#D1D5DB] rounded-lg px-3 py-3 focus-within:border-[#16A34A] transition-colors">
              <MessageSquare size={18} className="text-[#4B5563]" />
              <input type="text" defaultValue="Monthly Saving Deposit" className="w-full text-sm ml-3 font-semibold text-[#4B5563] outline-none" />
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-luxury-cream)] border-t border-[#E5E7EB] p-4 flex gap-3 z-30 pb-safe">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 py-3.5 rounded-xl border border-red-500 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors active:scale-95"
        >
          <X size={18} strokeWidth={2.5} />
          Cancel
        </button>
        <button className="flex-[1.5] py-3.5 rounded-xl bg-[#065F46] text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#064E3B] transition-colors active:scale-95">
          <Save size={18} strokeWidth={2.5} />
          Save Deposit
        </button>
      </div>

    </div>
  );
};

export default MemberDeposit;
