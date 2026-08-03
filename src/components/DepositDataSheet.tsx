import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Filter, 
  Calendar, 
  User, 
  Wallet, 
  Download, 
  CalendarDays,
  FileText,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member, Deposit } from '../types';

interface DepositDataSheetProps {
  members: Member[];
  deposits: Deposit[];
}

const DepositDataSheet: React.FC<DepositDataSheetProps> = ({ members, deposits }) => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  
  // Fake filtered data based on screenshot
  const filteredDeposits = deposits.filter(d => d.status === 'Paid');
  const totalAmount = filteredDeposits.reduce((sum, d) => sum + d.amount, 0);
  const totalTransactions = filteredDeposits.length;

  return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] font-['Inter',sans-serif] text-[#111827]">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-luxury-cream)] pt-safe px-4 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-[#4a0404]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#4a0404]">Deposit Data Sheet</h1>
            <p className="text-[10px] text-[#6B7280] mt-0.5">View all member deposit records</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6 pb-24">
        
        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">From Date</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2">
              <Calendar size={14} className="text-[#4B5563]" />
              <input type="text" defaultValue="01 Aug 2026" className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">To Date</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2">
              <Calendar size={14} className="text-[#4B5563]" />
              <input type="text" defaultValue="31 Aug 2026" className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">Month</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2 relative">
              <Calendar size={14} className="text-[#4B5563]" />
              <select className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827] appearance-none bg-transparent pr-4">
                <option>August 2026</option>
                <option>July 2026</option>
              </select>
              <ChevronDown size={14} className="text-[#4B5563] absolute right-2 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">Member</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2 relative">
              <User size={14} className="text-[#4B5563]" />
              <select className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827] appearance-none bg-transparent pr-4">
                <option>Ujjwal Bhaviha</option>
                <option>All Members</option>
              </select>
              <ChevronDown size={14} className="text-[#4B5563] absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>



        {/* Data Table */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-6 overflow-x-auto shadow-sm">
          <table className="w-full text-center text-xs whitespace-nowrap">
            <thead className="bg-[#4a0404] text-[#c5a059]">
              <tr>
                <th className="py-3 px-2 font-semibold border-r border-[#5c0505]">SN</th>
                <th className="py-3 px-3 font-semibold border-r border-[#5c0505]">Name</th>
                <th className="py-3 px-3 font-semibold border-r border-[#5c0505]">Month</th>
                <th className="py-3 px-3 font-semibold border-r border-[#5c0505]">Date</th>
                <th className="py-3 px-3 font-semibold border-r border-[#5c0505]">Amount (₹)</th>
                <th className="py-3 px-3 font-semibold">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4B5563]">
              {/* Row 1 */}
              <tr className="border-b border-[#E5E7EB]">
                <td className="py-3 px-2 border-r border-[#E5E7EB] font-medium">1</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">Ujjwal Bhaviha</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">August 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">15 Aug 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">500</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <Wallet size={14} className="text-[#16A34A]" />
                    <span className="font-semibold text-[#111827]">Cash</span>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <td className="py-3 px-2 border-r border-[#E5E7EB] font-medium">2</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">Ujjwal Bhaviha</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">July 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">15 Jul 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">300</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <div className="flex -space-x-1 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                    </div>
                    <span className="font-semibold text-[#111827]">UPI</span>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="border-b border-[#E5E7EB]">
                <td className="py-3 px-2 border-r border-[#E5E7EB] font-medium">3</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">Ujjwal Bhaviha</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">June 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">15 Jun 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">300</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4B5563]"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                    <span className="font-semibold text-[#111827]">A/C Transfer</span>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <td className="py-3 px-2 border-r border-[#E5E7EB] font-medium">4</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">Ujjwal Bhaviha</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">May 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">15 May 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">300</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <Wallet size={14} className="text-[#16A34A]" />
                    <span className="font-semibold text-[#111827]">Cash</span>
                  </div>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="border-b border-[#E5E7EB]">
                <td className="py-3 px-2 border-r border-[#E5E7EB] font-medium">5</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">Ujjwal Bhaviha</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">April 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-medium">15 Apr 2026</td>
                <td className="py-3 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">300</td>
                <td className="py-3 px-3">
                  <div className="flex items-center justify-center gap-1">
                    <div className="flex -space-x-1 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-sm bg-orange-500"></div>
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                    </div>
                    <span className="font-semibold text-[#111827]">UPI</span>
                  </div>
                </td>
              </tr>
              {/* Empty Rows to match screenshot */}
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] h-10">
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td></td>
              </tr>
              <tr className="border-b border-[#E5E7EB] h-10">
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td></td>
              </tr>
              <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB] h-10">
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td className="border-r border-[#E5E7EB]"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>



        {/* Export Buttons */}
        <div className="flex gap-3 pb-8">
          <button className="flex-1 py-3.5 rounded-xl border-2 border-[#4a0404] text-[#4a0404] font-bold flex items-center justify-center gap-2 hover:bg-[#faf5eb] transition-colors">
            <FileText size={18} />
            Export PDF
          </button>
          <button className="flex-1 py-3.5 rounded-xl bg-[#4a0404] text-[#c5a059] border border-[#c5a059]/30 font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#4a0404]/30 hover:bg-[#3a0303] transition-colors">
            <FileSpreadsheet size={18} />
            Export Excel
          </button>
        </div>

      </div>

    </div>
  );
};

export default DepositDataSheet;
