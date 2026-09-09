import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, ChevronRight, Loader2, RefreshCw,
  AlertCircle, FileSpreadsheet, Wallet, Landmark,
  FileText, PiggyBank, HandCoins, FolderOpen, Folder,
  Calendar, Users, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../types';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbylJG300iJuV4Ue7qSPFFJOeP8V9n6gO2ZWihN69zwmoTsHwUTNHArSwrUfrV7H-j2aTA/exec';

interface SheetDeposit {
  sn: number; memberId: string; name: string;
  month: string; date: string; amount: number;
  paymentMode: string; depositType: string;
  remark: string; status: string; timestamp: string;
}
interface DepositDataSheetProps { members: Member[]; }

// Clean Month string formatter (converts ISO timestamps like 2026-08-31T18:30... to 'September 2026')
function formatMonthDisplay(val: string): string {
  if (!val) return 'Unknown Month';
  const str = String(val).trim();
  if (/^[A-Za-z]+\s+\d{4}$/.test(str)) return str;

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return str;
}

// Clean Date string formatter (converts ISO timestamps to '09 Sep 2026')
function formatDateDisplay(val: string): string {
  if (!val) return '—';
  const str = String(val).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) return str;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split('-');
    const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return str;
}

// Resolve member name from ID
function resolveName(d: SheetDeposit, members: Member[]): string {
  if (d.name && d.name.trim() !== '' && d.name !== d.memberId) return d.name;
  const exact = members.find(m => m.id === d.memberId);
  if (exact) return exact.name;
  const num = String(d.memberId).match(/(\d+)/);
  if (num) {
    const n = parseInt(num[1], 10);
    const m = members.find(m2 => { const m2n = String(m2.id).match(/(\d+)/); return m2n && parseInt(m2n[1],10) === n; });
    if (m) return m.name;
  }
  return d.memberId || '—';
}

const PaymentCell: React.FC<{ mode: string }> = ({ mode }) => {
  if (mode === 'Cash') return <div className="flex items-center justify-center gap-1"><Wallet size={12} className="text-green-600"/><span className="font-semibold text-[#111827]">Cash</span></div>;
  if (mode === 'UPI')  return <div className="flex items-center justify-center gap-1"><span className="flex gap-0.5"><span className="w-2 h-2 rounded-sm bg-orange-500 inline-block"/><span className="w-2 h-2 rounded-sm bg-green-500 inline-block"/></span><span className="font-semibold text-[#111827]">UPI</span></div>;
  if (mode === 'A/C Transfer') return <div className="flex items-center justify-center gap-1"><Landmark size={12} className="text-blue-500"/><span className="font-semibold text-[#111827]">A/C Transfer</span></div>;
  return <span className="font-semibold text-[#111827]">{mode || '—'}</span>;
};

// Month display color theme
const MONTH_COLORS: Record<string, { bg: string; border: string; icon: string; dot: string }> = {
  default: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-700', dot: 'bg-amber-500' },
};
const getColor = (month: string) => {
  const m = (month || '').toLowerCase();
  if (m.includes('jan')) return { bg:'bg-blue-50',   border:'border-blue-200',   icon:'text-blue-700',   dot:'bg-blue-500' };
  if (m.includes('feb')) return { bg:'bg-pink-50',   border:'border-pink-200',   icon:'text-pink-700',   dot:'bg-pink-500' };
  if (m.includes('mar')) return { bg:'bg-green-50',  border:'border-green-200',  icon:'text-green-700',  dot:'bg-green-500' };
  if (m.includes('apr')) return { bg:'bg-purple-50', border:'border-purple-200', icon:'text-purple-700', dot:'bg-purple-500' };
  if (m.includes('may')) return { bg:'bg-yellow-50', border:'border-yellow-200', icon:'text-yellow-700', dot:'bg-yellow-500' };
  if (m.includes('jun')) return { bg:'bg-cyan-50',   border:'border-cyan-200',   icon:'text-cyan-700',   dot:'bg-cyan-500' };
  if (m.includes('jul')) return { bg:'bg-orange-50', border:'border-orange-200', icon:'text-orange-700', dot:'bg-orange-500' };
  if (m.includes('aug')) return { bg:'bg-red-50',    border:'border-red-200',    icon:'text-red-700',    dot:'bg-red-500' };
  if (m.includes('sep')) return { bg:'bg-teal-50',   border:'border-teal-200',   icon:'text-teal-700',   dot:'bg-teal-500' };
  if (m.includes('oct')) return { bg:'bg-indigo-50', border:'border-indigo-200', icon:'text-indigo-700', dot:'bg-indigo-500' };
  if (m.includes('nov')) return { bg:'bg-lime-50',   border:'border-lime-200',   icon:'text-lime-700',   dot:'bg-lime-500' };
  if (m.includes('dec')) return { bg:'bg-rose-50',   border:'border-rose-200',   icon:'text-rose-700',   dot:'bg-rose-500' };
  return MONTH_COLORS.default;
};

const DepositDataSheet: React.FC<DepositDataSheetProps> = ({ members }) => {
  const navigate = useNavigate();
  const [allDeposits, setAllDeposits] = useState<SheetDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]    = useState<string | null>(null);
  const [openMonth, setOpenMonth] = useState<string | null>(null); // null = folder view

  const fetchDeposits = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${SHEET_URL}?action=getDeposits`);
      const json = await res.json();
      if (json.status === 'success') setAllDeposits(json.data || []);
      else setError(json.message || 'Data nahi aaya');
    } catch { setError('Internet ya Sheet URL mein problem hai.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchDeposits(); }, []);

  // Resolve names & format month/date displays
  const resolved = allDeposits.map(d => ({
    ...d,
    name: resolveName(d, members),
    monthDisplay: formatMonthDisplay(d.month),
    dateDisplay: formatDateDisplay(d.date),
  }));

  // Group by formatted month string
  const monthMap: Record<string, typeof resolved> = {};
  resolved.forEach(d => {
    const key = d.monthDisplay || 'Unknown Month';
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push(d);
  });
  const monthList = Object.keys(monthMap);

  // Month detail rows
  const monthRows = openMonth ? (monthMap[openMonth] || []) : [];
  const monthTotal = monthRows.reduce((s, d) => s + Number(d.amount || 0), 0);

  // ═══════════════════════════════════════════
  // SCREEN 1: Month Folder View
  // ═══════════════════════════════════════════
  if (!openMonth) return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] font-['Inter',sans-serif] flex flex-col">

      {/* Component Header - sticky below app header */}
      <div className="sticky top-0 z-10 bg-[var(--color-luxury-cream)] px-4 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-[#4a0404]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#4a0404]">Deposit Data Sheet</h1>
            <p className="text-[10px] text-[#6B7280] mt-0.5">Month wise records</p>
          </div>
        </div>
        <button onClick={fetchDeposits} disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors disabled:opacity-40">
          <RefreshCw size={15} className={`text-[#4a0404] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Folder list - scrolls with page */}
      <div className="px-4 pt-5 pb-24">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={34} className="text-[#4a0404] animate-spin" />
            <p className="text-xs font-semibold text-[#6B7280]">Google Sheet se data load ho raha hai…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-red-600 font-semibold">⚠️ {error}</span>
            <button onClick={fetchDeposits} className="text-xs underline text-red-600 ml-2">Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && monthList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-full bg-[#4a0404]/10 flex items-center justify-center">
              <FolderOpen size={28} className="text-[#4a0404]" />
            </div>
            <p className="text-sm font-bold text-[#4B5563]">Koi deposit record nahi mila</p>
            <p className="text-[10px] text-[#9CA3AF] text-center px-8">Pehle koi deposit save karo</p>
          </div>
        )}

        {/* Month Folder Grid */}
        {!loading && !error && monthList.length > 0 && (
          <>
            <p className="text-xs font-bold text-[#6B7280] mb-3">
              {monthList.length} month{monthList.length > 1 ? 's' : ''} ka data available hai
            </p>

            <div className="space-y-3">
              {monthList.map(month => {
                const rows = monthMap[month];
                const total = rows.reduce((s, d) => s + Number(d.amount || 0), 0);
                const color = getColor(month);

                return (
                  <button
                    key={month}
                    onClick={() => setOpenMonth(month)}
                    className={`w-full ${color.bg} border ${color.border} rounded-2xl px-4 py-4 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] text-left`}
                  >
                    {/* Folder Icon */}
                    <div className={`w-12 h-12 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0 shadow-sm`}>
                      <FolderOpen size={26} className={color.icon} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-black text-[#111827] leading-tight">{month}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#6B7280]">
                          <Users size={10} /> {rows.length} records
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#4a0404]">
                          <IndianRupee size={10} /> {total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={20} className={`${color.icon} shrink-0`} />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // SCREEN 2: Month Detail (Table)
  // ═══════════════════════════════════════════
  const color = getColor(openMonth || '');
  return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] font-['Inter',sans-serif] flex flex-col">

      {/* Component Header - sticky below app header */}
      <div className="sticky top-0 z-10 bg-[var(--color-luxury-cream)] px-4 py-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpenMonth(null)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#4a0404]/10 transition-colors">
            <ArrowLeft size={22} className="text-[#4a0404]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#4a0404]">{openMonth}</h1>
            <p className="text-[10px] text-[#6B7280] mt-0.5">{monthRows.length} records • ₹{monthTotal.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full ${color.bg} border ${color.border}`}>
          <Calendar size={14} className={color.icon} />
        </div>
      </div>

      {/* Content - scrolls with page */}
      <div className="px-4 pt-5 pb-24">

        {/* Summary Bar */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 shadow-sm">
            <p className="text-[9px] font-semibold text-[#9CA3AF]">TOTAL RECORDS</p>
            <p className="text-2xl font-black text-[#4a0404]">{monthRows.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E5E7EB] px-4 py-3 shadow-sm">
            <p className="text-[9px] font-semibold text-[#9CA3AF]">TOTAL AMOUNT</p>
            <p className="text-2xl font-black text-[#4a0404]">₹{monthTotal.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Table */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden overflow-x-auto shadow-sm mb-5">
          <table className="text-center text-[10px] whitespace-nowrap border-collapse">
            <thead className="bg-[#4a0404] text-[#c5a059]">
              <tr>
                {['SN','Member ID','Member Name','Month','Date','Amount (Rs)','Payment Mode','Deposit Type','Remark','Status','Timestamp']
                  .map((col, i, arr) => (
                  <th key={col} className={`py-2.5 px-3 font-semibold ${i < arr.length-1 ? 'border-r border-[#5c0505]' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white text-[#4B5563]">
              {monthRows.length === 0 ? (
                <tr><td colSpan={11} className="py-10 text-center text-[#9CA3AF] font-semibold text-xs">Koi record nahi</td></tr>
              ) : monthRows.map((d, idx) => (
                <tr key={idx} className={`border-b border-[#E5E7EB] ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}`}>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">{d.sn || idx+1}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium text-[#6B7280]">{d.memberId || '—'}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-bold text-[#111827] text-left min-w-[120px]">{d.name}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">{d.monthDisplay}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">{d.dateDisplay}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">{Number(d.amount).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB]"><PaymentCell mode={d.paymentMode} /></td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB]">
                    <div className="flex items-center justify-center gap-1">
                      {d.depositType === 'Saving Account' ? <><PiggyBank size={11} className="text-green-600"/><span className="font-medium">Saving</span></>
                      : d.depositType === 'Loan Account'  ? <><HandCoins size={11} className="text-orange-500"/><span className="font-medium">Loan</span></>
                      : <span className="font-medium">{d.depositType || '—'}</span>}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB] text-[#9CA3AF] max-w-[120px]">
                    <span className="block truncate max-w-[120px]">{d.remark || '—'}</span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-[#E5E7EB]">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      d.status === 'Paid' ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>{d.status || 'Paid'}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[9px] text-[#9CA3AF]">
                    {d.timestamp ? new Date(d.timestamp).toLocaleString('en-IN',{day:'2-digit',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 pb-4">
          <button className="flex-1 py-3.5 rounded-xl border-2 border-[#4a0404] text-[#4a0404] font-bold flex items-center justify-center gap-2 hover:bg-[#faf5eb] transition-colors">
            <FileText size={17} /> Export PDF
          </button>
          <button className="flex-1 py-3.5 rounded-xl bg-[#4a0404] text-[#c5a059] border border-[#c5a059]/30 font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#3a0303] transition-colors">
            <FileSpreadsheet size={17} /> Export Excel
          </button>
        </div>

      </div>
    </div>
  );
};

export default DepositDataSheet;
