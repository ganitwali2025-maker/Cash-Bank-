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
  ArrowDown, 
  Coins, 
  X, 
  Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberDeposit: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-['Poppins'] animate-fade-in-up">
      {/* Top App Bar with Green Gradient */}
      <div className="bg-deposit-gradient pt-safe pb-16 px-4 flex items-center justify-between text-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          💰 Member Deposit
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors">
          <FileText size={24} />
        </button>
      </div>

      {/* Main Content Sheet (Overlaps the green header) */}
      <div className="bg-white rounded-t-[24px] -mt-10 px-4 pt-6 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] relative z-20 min-h-screen">
        
        {/* Member Information Card */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E5E7EB] soft-shadow">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Member Name</span>
            <div className="flex items-center gap-2 mt-1">
              <User size={16} className="text-deposit" />
              <span className="text-sm font-semibold text-[#111827]">Ujjwal Bhaviha</span>
            </div>
          </div>
          <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E5E7EB] soft-shadow">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Member ID</span>
            <div className="flex items-center gap-2 mt-1">
              <IdCard size={16} className="text-deposit" />
              <span className="text-sm font-semibold text-[#111827]">MBR10024</span>
            </div>
          </div>
        </div>

        {/* Deposit Form */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#6B7280] font-medium ml-1">Date</label>
              <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 soft-shadow focus-within:border-[#16A34A] transition-colors">
                <Calendar size={18} className="text-[#6B7280]" />
                <input type="text" defaultValue="15 Aug 2026" className="w-full text-sm ml-2 outline-none text-[#111827] font-medium" />
                <Calendar size={18} className="text-[#6B7280]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#6B7280] font-medium ml-1">Month</label>
              <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 soft-shadow focus-within:border-[#16A34A] transition-colors">
                <Calendar size={18} className="text-[#6B7280]" />
                <select className="w-full text-sm ml-2 outline-none text-[#111827] font-medium appearance-none bg-transparent">
                  <option>August 2026</option>
                  <option>September 2026</option>
                </select>
                <ChevronDown size={18} className="text-[#6B7280]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-[#6B7280] font-medium ml-1">Payment Mode</label>
              <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 soft-shadow focus-within:border-[#16A34A] transition-colors">
                <CreditCard size={18} className="text-[#6B7280]" />
                <select className="w-full text-sm ml-2 outline-none text-[#111827] font-medium appearance-none bg-transparent">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank</option>
                </select>
                <ChevronDown size={18} className="text-[#6B7280]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#6B7280] font-medium ml-1">Account Type</label>
              <div className="flex items-center justify-between bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 soft-shadow focus-within:border-[#16A34A] transition-colors">
                <div className="flex items-center text-[#6B7280]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                </div>
                <select className="w-full text-sm ml-2 outline-none text-[#111827] font-medium appearance-none bg-transparent">
                  <option>Saving Account</option>
                  <option>Loan EMI</option>
                </select>
                <ChevronDown size={18} className="text-[#6B7280]" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium ml-1">Deposit Amount (₹)</label>
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-3 soft-shadow focus-within:border-[#16A34A] focus-within:ring-1 focus-within:ring-[#16A34A] transition-all">
              <span className="text-lg font-medium text-[#111827]">₹</span>
              <input type="number" defaultValue="500" className="w-full text-lg ml-2 outline-none text-[#111827] font-semibold" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6B7280] font-medium ml-1">Remark (Optional)</label>
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-xl px-3 py-3 soft-shadow focus-within:border-[#16A34A] transition-colors">
              <MessageSquare size={18} className="text-[#6B7280]" />
              <input type="text" defaultValue="Monthly Saving Deposit" className="w-full text-sm ml-2 outline-none text-[#111827]" />
            </div>
          </div>
        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-deposit font-medium mb-2 leading-tight">Previous Balance</span>
            <Wallet size={20} className="text-[#0891B2] mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 12,500</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-deposit font-medium mb-2 leading-tight">Today's Deposit</span>
            <ArrowDown size={20} className="text-deposit mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 500</span>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 flex flex-col items-center justify-center text-center soft-shadow-lg">
            <span className="text-[10px] text-deposit font-medium mb-2 leading-tight">Current Balance</span>
            <Coins size={20} className="text-deposit mb-1" />
            <span className="text-sm font-bold text-[#111827]">₹ 13,000</span>
          </div>
        </div>

        {/* Deposit History */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-6 h-6 rounded-full bg-[#F0FDF4] flex items-center justify-center">
              <Calendar size={14} className="text-deposit" />
            </div>
            <h2 className="text-sm font-bold text-[#111827]">Deposit History</h2>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] soft-shadow">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#15803D] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-medium border-r border-[#16A34A]">Date</th>
                  <th className="py-2.5 px-3 font-medium border-r border-[#16A34A]">Month</th>
                  <th className="py-2.5 px-3 font-medium border-r border-[#16A34A]">Amount (₹)</th>
                  <th className="py-2.5 px-3 font-medium border-r border-[#16A34A]">Payment Mode</th>
                  <th className="py-2.5 px-3 font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#4B5563]">
                <tr className="border-b border-[#E5E7EB]">
                  <td className="py-3 px-3 font-medium text-[#111827] border-r border-[#E5E7EB]">15 Aug 2026</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">August</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">500</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">Cash</td>
                  <td className="py-3 px-3 text-[10px]">Monthly Saving</td>
                </tr>
                <tr className="bg-[#F8FAFC]">
                  <td className="py-3 px-3 font-medium text-[#111827] border-r border-[#E5E7EB]">15 Jul 2026</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">July</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">300</td>
                  <td className="py-3 px-3 border-r border-[#E5E7EB]">UPI</td>
                  <td className="py-3 px-3 text-[10px]">Monthly Saving</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Buttons */}
      <div className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#E5E7EB] p-4 flex gap-3 z-30">
        <button className="flex-1 py-3.5 rounded-[18px] border-2 border-[var(--color-deposit-primary)] text-[var(--color-deposit-primary)] font-semibold flex items-center justify-center gap-2 hover:bg-[#F0FDF4] transition-colors active:scale-95">
          <X size={18} />
          Cancel
        </button>
        <button className="flex-[1.5] py-3.5 rounded-[18px] bg-deposit-gradient text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all active:scale-95">
          <Save size={18} />
          Save Deposit
        </button>
      </div>
    </div>
  );
};

export default MemberDeposit;
