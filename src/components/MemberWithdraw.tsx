import React from 'react';
import { 
  ChevronLeft, 
  FileText, 
  User, 
  IdCard, 
  Calendar, 
  ChevronDown, 
  CreditCard, 
  MessageSquare, 
  Wallet, 
  ArrowUpRight, 
  Database, 
  X, 
  Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../types';

interface MemberWithdrawProps {
  members: Member[];
}

const MemberWithdraw: React.FC<MemberWithdrawProps> = ({ members }) => {
  const navigate = useNavigate();
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members.length > 0 ? members[0].id : '');

  return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] pb-24 font-['Poppins'] animate-fade-in-up">
      {/* Top App Bar with Main App Theme */}
      <div className="bg-[#4a0404] pt-safe pb-16 px-4 flex items-center justify-between text-[#fdfbf7] sticky top-0 z-10 border-b border-[#c5a059]/20 shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-[#c5a059]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2 uppercase tracking-wider font-display text-[#c5a059]">
          Member Withdraw
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-[#c5a059]">
          <FileText size={24} />
        </button>
      </div>

      {/* Main Content Sheet */}
      <div className="bg-white rounded-t-[24px] -mt-10 px-4 pt-6 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] relative z-20 min-h-screen border-t-2 border-[#c5a059]">
        
        {/* Member Selection */}
        <div className="mb-6">
          <label className="text-xs text-[#6B7280] font-medium ml-1">Select Member</label>
          <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3.5 soft-shadow focus-within:border-[#c5a059] transition-colors mt-1 relative">
            <User size={20} className="text-[#c5a059]" />
            <select 
              className="w-full text-base ml-3 outline-none text-[#111827] font-semibold appearance-none bg-transparent"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
              {members.length === 0 && <option value="">No members available</option>}
            </select>
            <ChevronDown size={20} className="text-[#6B7280]" />
          </div>
        </div>

        {/* Dynamic Member Info */}
        {(() => {
          const member = members.find(m => m.id === selectedMemberId);
          if (!member) return null;
          return (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] soft-shadow">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Member ID</span>
                <div className="flex items-center gap-2 mt-1">
                  <IdCard size={16} className="text-[#c5a059]" />
                  <span className="text-sm font-semibold text-[#111827]">{member.id}</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] soft-shadow">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Mobile No</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-[#111827]">{member.phone}</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Withdraw Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111827]">Date <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus-within:border-[#16A34A] transition-colors relative">
                <input 
                  type="date" 
                  defaultValue="2026-08-15" 
                  className="w-full text-sm font-bold text-[#111827] outline-none bg-transparent appearance-none" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#111827]">Month <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-between border border-[#D1D5DB] rounded-lg px-3 py-2.5 focus-within:border-[#16A34A] transition-colors relative">
                <select className="w-full text-sm font-bold text-[#111827] outline-none appearance-none bg-transparent pr-6">
                  <option>January 2026</option>
                  <option>February 2026</option>
                  <option>March 2026</option>
                  <option>April 2026</option>
                  <option>May 2026</option>
                  <option>June 2026</option>
                  <option>July 2026</option>
                  <option>August 2026</option>
                  <option>September 2026</option>
                  <option>October 2026</option>
                  <option>November 2026</option>
                  <option>December 2026</option>
                </select>
                <ChevronDown size={18} className="text-[#4B5563] absolute right-3 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium ml-1">Payment Mode</label>
            <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 soft-shadow focus-within:border-[#c5a059] transition-colors">
              <CreditCard size={18} className="text-[#6B7280]" />
              <select className="w-full text-sm ml-2 outline-none text-[#111827] font-medium appearance-none bg-transparent">
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
              </select>
              <ChevronDown size={18} className="text-[#6B7280]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium ml-1">Withdraw Amount (₹)</label>
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-3 soft-shadow focus-within:border-[#c5a059] focus-within:ring-1 focus-within:ring-[#c5a059] transition-all">
              <span className="text-lg font-medium text-[#111827]">₹</span>
              <input type="number" defaultValue="1000" className="w-full text-lg ml-2 outline-none text-[#111827] font-semibold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium ml-1">Withdraw Reason</label>
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-3 soft-shadow focus-within:border-[#c5a059] transition-colors">
              <MessageSquare size={18} className="text-[#6B7280]" />
              <input type="text" defaultValue="Personal Use" className="w-full text-sm ml-2 outline-none text-[#111827]" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 mt-2 border-t border-[#E5E7EB]">
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 py-3.5 rounded-xl border border-red-500 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors active:scale-95"
            >
              <X size={18} strokeWidth={2.5} />
              Cancel
            </button>
            <button className="flex-[1.5] py-3.5 rounded-xl bg-[#991B1B] text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#7F1D1D] transition-colors active:scale-95">
              <Save size={18} strokeWidth={2.5} />
              Save Withdraw
            </button>
          </div>

        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-[#c5a059] font-medium mb-2 leading-tight">Available Balance</span>
            <Wallet size={20} className="text-[#E11D48] mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 13,000</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-[#c5a059] font-medium mb-2 leading-tight">Withdraw Amount</span>
            <ArrowUpRight size={20} className="text-[#c5a059] mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 1,000</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-[#c5a059] font-medium mb-2 leading-tight">Remaining Balance</span>
            <Database size={20} className="text-[#E11D48] mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 12,000</span>
          </div>
        </div>



      </div>


    </div>
  );
};

export default MemberWithdraw;
