import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Calendar, User, Wallet, FileText, FileSpreadsheet,
  ChevronDown, Loader2, RefreshCw, Landmark, AlertCircle,
  PiggyBank, HandCoins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member } from '../types';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbylJG300iJuV4Ue7qSPFFJOeP8V9n6gO2ZWihN69zwmoTsHwUTNHArSwrUfrV7H-j2aTA/exec';

interface SheetDeposit {
  sn: number;
  memberId: string;
  name: string;
  month: string;
  date: string;
  amount: number;
  paymentMode: string;
  depositType: string;
  remark: string;
  status: string;
  timestamp: string;
}

interface DepositDataSheetProps {
  members: Member[];
}

const PaymentCell: React.FC<{ mode: string }> = ({ mode }) => {
  if (mode === 'Cash') return (
    <div className="flex items-center justify-center gap-1">
      <Wallet size={13} className="text-[#16A34A]" />
      <span className="font-semibold text-[#111827]">Cash</span>
    </div>
  );
  if (mode === 'UPI') return (
    <div className="flex items-center justify-center gap-1">
      <div className="flex -space-x-1 shrink-0">
        <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
        <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
      </div>
      <span className="font-semibold text-[#111827]">UPI</span>
    </div>
  );
  if (mode === 'A/C Transfer') return (
    <div className="flex items-center justify-center gap-1">
      <Landmark size={13} className="text-[#4B5563]" />
      <span className="font-semibold text-[#111827]">A/C Transfer</span>
    </div>
  );
  return <span className="font-semibold text-[#111827]">{mode || '—'}</span>;
};

const DepositDataSheet: React.FC<DepositDataSheetProps> = ({ members }) => {
  const navigate = useNavigate();

  const [allDeposits, setAllDeposits] = useState<SheetDeposit[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [selMonth,  setSelMonth]  = useState('All');
  const [selMember, setSelMember] = useState('All');

  const months   = ['All', ...Array.from(new Set(allDeposits.map(d => d.month))).filter(Boolean)];
  // Names: sheet se aaye jo hon + app ke members bhi
  const members_ = ['All', ...Array.from(new Set([
    ...allDeposits.map(d => d.name).filter(Boolean),
    ...members.map(m => m.name)
  ]))];

  const fetchDeposits = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${SHEET_URL}?action=getDeposits`);
      const json = await res.json();
      if (json.status === 'success') setAllDeposits(json.data || []);
      else setError(json.message || 'Data nahi aaya');
    } catch {
      setError('Internet ya Sheet URL mein problem hai.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDeposits(); }, []);

  const rows = allDeposits.map((d, depositIdx) => {
    let resolvedName = (d.name && d.name.trim() !== '' && d.name !== d.memberId)
      ? d.name
      : '';

    if (!resolvedName) {
      // Try 1: exact ID match (member-1 === member-1)
      const exactMatch = members.find(m => m.id === d.memberId);
      if (exactMatch) {
        resolvedName = exactMatch.name;
      } else {
        // Try 2: extract number from memberId (M001 → 1, member-1 → 1)
        const numMatch = String(d.memberId).match(/(\d+)/);
        if (numMatch) {
          const num = parseInt(numMatch[1], 10);
          // member IDs are "member-1", "member-2"... so index = num-1
          const idxMatch = members.find(m => {
            const mNum = String(m.id).match(/(\d+)/);
            return mNum && parseInt(mNum[1], 10) === num;
          });
          if (idxMatch) resolvedName = idxMatch.name;
        }
      }
    }

    // Final fallback: show memberId if still no name
    return { ...d, name: resolvedName || d.memberId || '—' };
  }).filter(d =>
    (selMonth  === 'All' || d.month === selMonth) &&
    (selMember === 'All' || d.name  === selMember || d.memberId === selMember)
  );

  return (
    <div className="min-h-screen bg-[var(--color-luxury-cream)] font-['Inter',sans-serif] text-[#111827]">

      {/* ── Header ──────────────────────────────── */}
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
        <button onClick={fetchDeposits} disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] transition-colors disabled:opacity-40">
          <RefreshCw size={15} className={`text-[#4a0404] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="px-4 pt-6 pb-24">

        {/* ── Filters ──────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">Month</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2 relative bg-white">
              <Calendar size={14} className="text-[#4B5563]" />
              <select value={selMonth} onChange={e => setSelMonth(e.target.value)}
                className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827] appearance-none bg-transparent pr-4">
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} className="text-[#4B5563] absolute right-2 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#6B7280]">Member</label>
            <div className="flex items-center border border-[#E5E7EB] rounded-lg px-2.5 py-2 relative bg-white">
              <User size={14} className="text-[#4B5563]" />
              <select value={selMember} onChange={e => setSelMember(e.target.value)}
                className="w-full text-xs font-bold ml-1.5 outline-none text-[#111827] appearance-none bg-transparent pr-4">
                {members_.map(n => <option key={n}>{n}</option>)}
              </select>
              <ChevronDown size={14} className="text-[#4B5563] absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── Loading ───────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={32} className="text-[#4a0404] animate-spin" />
            <p className="text-xs font-semibold text-[#6B7280]">Google Sheet se data load ho raha hai...</p>
          </div>
        )}

        {/* ── Error ─────────────────────────────── */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-semibold mb-4 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={fetchDeposits} className="text-xs underline ml-2">Retry</button>
          </div>
        )}

        {/* ── Table (all 11 columns, horizontal scroll) ── */}
        {!loading && !error && (
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-6 overflow-x-auto shadow-sm">
            <table className="text-center text-[10px] whitespace-nowrap border-collapse">

              {/* Header row */}
              <thead className="bg-[#4a0404] text-[#c5a059]">
                <tr>
                  {[
                    'SN', 'Member ID', 'Member Name',
                    'Month', 'Date', 'Amount (Rs)',
                    'Payment Mode', 'Deposit Type',
                    'Remark', 'Status', 'Timestamp'
                  ].map((col, i, arr) => (
                    <th key={col}
                      className={`py-2.5 px-3 font-semibold ${i < arr.length - 1 ? 'border-r border-[#5c0505]' : ''}`}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody className="bg-white text-[#4B5563]">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-[#9CA3AF] font-semibold text-xs">
                      Koi deposit record nahi mila
                    </td>
                  </tr>
                ) : rows.map((d, idx) => (
                  <tr key={idx}
                    className={`border-b border-[#E5E7EB] ${idx % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}`}>

                    {/* SN */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">
                      {d.sn || idx + 1}
                    </td>

                    {/* Member ID */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium text-[#6B7280]">
                      {d.memberId || '—'}
                    </td>

                    {/* Member Name */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-bold text-[#111827] text-left min-w-[130px]">
                      {d.name || '—'}
                    </td>

                    {/* Month */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">
                      {d.month}
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium">
                      {d.date}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-bold text-[#111827]">
                      {Number(d.amount).toLocaleString('en-IN')}
                    </td>

                    {/* Payment Mode */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB]">
                      <PaymentCell mode={d.paymentMode} />
                    </td>

                    {/* Deposit Type */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB]">
                      <div className="flex items-center justify-center gap-1">
                        {d.depositType === 'Saving Account'
                          ? <><PiggyBank size={12} className="text-[#16A34A]" /><span className="font-medium">Saving A/C</span></>
                          : d.depositType === 'Loan Account'
                          ? <><HandCoins size={12} className="text-orange-500" /><span className="font-medium">Loan A/C</span></>
                          : <span className="font-medium">{d.depositType || '—'}</span>
                        }
                      </div>
                    </td>

                    {/* Remark */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB] font-medium text-[#6B7280] max-w-[140px]">
                      <span className="block truncate max-w-[140px]">{d.remark || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 border-r border-[#E5E7EB]">
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        d.status === 'Paid'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {d.status || 'Paid'}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-2.5 px-3 text-[9px] font-medium text-[#9CA3AF]">
                      {d.timestamp
                        ? new Date(d.timestamp).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: '2-digit',
                            hour: '2-digit', minute: '2-digit'
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Export Buttons ────────────────────── */}
        {!loading && !error && (
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
        )}

      </div>
    </div>
  );
};

export default DepositDataSheet;
