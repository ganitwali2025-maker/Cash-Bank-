import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical,
  PiggyBank,
  TrendingUp,
  Download,
  Book,
  FileText,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Phone,
  BellRing,
  Wallet,
  Landmark,
  Settings,
  Clock,
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Member, Deposit, Loan, LanguageType } from '../types';
import { numberToWords } from '../utils/numberToWords';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbylJG300iJuV4Ue7qSPFFJOeP8V9n6gO2ZWihN69zwmoTsHwUTNHArSwrUfrV7H-j2aTA/exec';

interface Props {
  members: Member[];
  deposits: Deposit[];
  loans: Loan[];
  language: LanguageType;
}

// Clean Month string formatter
function formatMonthDisplay(val: string): string {
  if (!val) return '—';
  const str = String(val).trim();
  if (/^[A-Za-z]+\s+\d{4}$/.test(str)) return str;

  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return str;
}

// Clean Date string formatter
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

export default function SavingsAccount({ members, deposits, loans, language }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const member = members.find(m => m.id === id);

  const [sheetDeposits, setSheetDeposits] = useState<any[]>([]);
  const [loadingSheet, setLoadingSheet] = useState<boolean>(true);
  const [viewingPassbook, setViewingPassbook] = useState<boolean>(false);

  const fetchSheetData = async () => {
    setLoadingSheet(true);
    try {
      const res = await fetch(`${SHEET_URL}?action=getDeposits`);
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setSheetDeposits(data.data);
      }
    } catch (err) {
      console.error('Error fetching sheet deposits in profile:', err);
    } finally {
      setLoadingSheet(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAF8F4] text-center">
        <p className="text-gray-500 font-sans">Member not found</p>
        <button onClick={() => navigate('/members')} className="mt-4 px-4 py-2 bg-[#6D0000] text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  // Extract member number (e.g. "1" from "member-1")
  const memberNum = String(member.id).match(/(\d+)/)?.[1];

  // Filter Google Sheet deposits for this specific member
  const memberSheetDeposits = sheetDeposits.filter(d => {
    if (!d) return false;
    const dMemId = String(d.memberId || '').toUpperCase();
    const targetId = String(member.id).toUpperCase();
    if (dMemId === targetId) return true;
    if (memberNum && (dMemId === `M00${memberNum}` || dMemId === `M0${memberNum}` || dMemId === `M${memberNum}`)) return true;
    if (d.name && d.name.toLowerCase().trim() === member.name.toLowerCase().trim()) return true;
    return false;
  });

  const memberLocalDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
  
  // Combine & format deposits for Passbook
  const passbookRecords = memberSheetDeposits.length > 0
    ? memberSheetDeposits.map((d, idx) => ({
        sn: d.sn || idx + 1,
        date: formatDateDisplay(d.date || d.timestamp),
        month: formatMonthDisplay(d.month),
        amount: Number(d.amount || 0),
        paymentMode: d.paymentMode || 'Cash',
        depositType: d.depositType || 'Saving Account',
        remark: d.remark || 'Monthly Deposit',
        status: d.status || 'Paid',
        timestamp: d.timestamp ? new Date(d.timestamp).toLocaleString('en-IN') : '—'
      }))
    : memberLocalDeposits.map((d, idx) => ({
        sn: idx + 1,
        date: formatDateDisplay(d.date),
        month: formatMonthDisplay(d.monthKey),
        amount: Number(d.amount || 0),
        paymentMode: 'Cash',
        depositType: 'Saving Account',
        remark: 'Monthly Deposit',
        status: 'Paid',
        timestamp: '—'
      }));

  // Calculate Live Total Balance from Sheet (or fallback to local)
  const totalBalance = passbookRecords.reduce((sum, d) => sum + d.amount, 0);
  const interestEarned = Math.round(totalBalance * 0.05);
  
  const lastTransaction = passbookRecords.length > 0 
    ? passbookRecords[passbookRecords.length - 1] 
    : null;

  // Active Status logic
  const memberLoans = loans.filter(l => l.memberId === member.id);
  const isActive = totalBalance > 0 || memberLoans.length > 0;

  // Download PDF Statement for this member
  const handleDownloadMemberPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for PDF download.');
      return;
    }

    const rowsHtml = passbookRecords.map((d, i) => `
      <tr>
        <td style="padding:6px; border:1px solid #ddd; text-align:center;">${d.sn || i + 1}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:center;">${d.date}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:center;">${d.month}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:right; font-weight:bold;">₹${d.amount.toLocaleString('en-IN')}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:center;">${d.paymentMode}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:center;">${d.depositType}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:left;">${d.remark}</td>
        <td style="padding:6px; border:1px solid #ddd; text-align:center; font-weight:bold; color:#16a34a;">${d.status}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>CASH BANK - ${member.name} Passbook</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #111827; }
            .header { text-align: center; border-bottom: 2px solid #4a0404; padding-bottom: 12px; margin-bottom: 16px; }
            .header h1 { margin: 0; color: #4a0404; font-size: 24px; font-weight: 800; }
            .header p { margin: 4px 0 0 0; color: #4b5563; font-size: 13px; font-weight: 600; }
            .summary { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 13px; font-weight: 700; background: #faf5eb; padding: 10px 16px; border-radius: 8px; border: 1px solid #e5d5b7; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #4a0404; color: #c5a059; padding: 8px; border: 1px solid #4a0404; text-align: center; }
            tr:nth-child(even) { background-color: #f9fafb; }
            @media print {
              body { padding: 0; }
              @page { size: landscape; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CASH BANK — MEMBER PASSBOOK</h1>
            <p>Member Name: ${member.name} | ID: ${member.id.replace('member-', 'MB-')}</p>
          </div>
          <div class="summary">
            <span>Total Entries: ${passbookRecords.length}</span>
            <span>Total Savings Balance: ₹${totalBalance.toLocaleString('en-IN')}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>SN</th><th>Date</th><th>Month</th><th>Amount (Rs)</th><th>Payment Mode</th><th>Deposit Type</th><th>Remark</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ═══════════════════════════════════════════
  // PASSBOOK SINGLE SHEET VIEW FOR THIS MEMBER
  // ═══════════════════════════════════════════
  if (viewingPassbook) {
    return (
      <div className="bg-[#FAF8F4] min-h-screen pb-24 font-sans flex flex-col">
        {/* Passbook Header */}
        <div className="bg-gradient-to-r from-[#5A0000] to-[#7a0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md border-b-[3px] border-[#D4AF37]">
          <div className="flex items-center gap-3">
            <button onClick={() => setViewingPassbook(false)} className="p-1.5 rounded-full hover:bg-white/10 transition">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-base font-bold uppercase tracking-wider">{member.name} Passbook</h1>
              <p className="text-[10px] text-white/70">Member ID: {member.id.replace('member-', 'MB-')}</p>
            </div>
          </div>
          <button
            onClick={handleDownloadMemberPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37] text-[#5A0000] font-bold text-xs shadow hover:bg-[#b3922e] transition"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Balance Summary Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-sm border border-[#D4AF37]/40 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Total Passbook Balance</p>
              <p className="text-2xl font-black text-[#5A0000]">₹{totalBalance.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Total Entries</p>
              <p className="text-lg font-black text-gray-900">{passbookRecords.length} Deposits</p>
            </div>
          </div>

          {/* Single Sheet Passbook Table (NO Folders) */}
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full text-center text-[10px] whitespace-nowrap border-collapse">
              <thead className="bg-[#5A0000] text-[#D4AF37]">
                <tr>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">#</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Date</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Month</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Amount (Rs)</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Payment Mode</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Deposit Type</th>
                  <th className="py-3 px-3 font-semibold border-r border-[#6D0000]">Remark</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {passbookRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-400 font-semibold text-xs">
                      Iss member ke liye koi deposit record nahi mila
                    </td>
                  </tr>
                ) : (
                  passbookRecords.map((d, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}>
                      <td className="py-3 px-3 border-r border-gray-100 font-medium">{d.sn}</td>
                      <td className="py-3 px-3 border-r border-gray-100 font-medium">{d.date}</td>
                      <td className="py-3 px-3 border-r border-gray-100 font-bold text-gray-900">{d.month}</td>
                      <td className="py-3 px-3 border-r border-gray-100 font-black text-green-700">₹{d.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 border-r border-gray-100 font-medium">{d.paymentMode}</td>
                      <td className="py-3 px-3 border-r border-gray-100 font-medium">{d.depositType}</td>
                      <td className="py-3 px-3 border-r border-gray-100 text-gray-500 text-left max-w-[120px] truncate">{d.remark}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // MAIN MEMBER PROFILE VIEW
  // ═══════════════════════════════════════════
  return (
    <div className="bg-[#FAF8F4] min-h-screen pb-24 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#5A0000] to-[#7a0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md border-b-[3px] border-[#D4AF37]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">Savings Account</h1>
        </div>
        <button onClick={fetchSheetData} disabled={loadingSheet} className="p-1.5 rounded-full hover:bg-white/10 transition">
          <RefreshCw className={`w-5 h-5 ${loadingSheet ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        
        {/* MEMBER PROFILE CARD */}
        <div className="bg-white rounded-[22px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#D4AF37]/50 flex flex-row items-center gap-3 relative overflow-hidden">
          {/* Left: Avatar */}
          <div className="w-[65px] h-[65px] shrink-0 rounded-full bg-[#FAF8F4] border-[2px] border-[#D4AF37] flex items-center justify-center shadow-[0_4px_10px_rgba(212,175,55,0.3)] overflow-hidden relative">
            {member.profileImage ? (
              <img src={member.profileImage} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#b3922e] flex items-center justify-center text-[#5A0000] text-2xl font-black">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Center: Details */}
          <div className="flex-1 min-w-0 z-10 text-left">
            <h2 className="text-[14px] font-black text-gray-900 uppercase tracking-wide truncate">{member.name}</h2>
            
            <div className="inline-flex items-center gap-1.5 bg-[#FAF8F4] px-2 py-0.5 rounded border border-gray-100 my-1">
              <span className="text-[9px] text-gray-500 font-bold">Member ID:</span>
              <span className="text-[9px] text-gray-800 font-bold">{member.id.replace('member-', 'MB-')}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-gray-600">
              <Phone className="w-3 h-3 text-[#D4AF37]" />
              <p className="text-[10px] font-bold">{member.phone}</p>
            </div>
          </div>

          {/* Right: Badges */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            {isActive ? (
              <span className="px-2 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase rounded flex items-center gap-1 border border-green-100">
                <ShieldCheck className="w-2.5 h-2.5" /> Active Member
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[8px] font-bold uppercase rounded flex items-center gap-1 border border-gray-100">
                INACTIVE
              </span>
            )}
            
            <div className="text-right">
              <p className="text-[7px] text-gray-400 font-bold uppercase mb-0.5">Account Opened</p>
              <div className="flex items-center justify-end gap-1 text-gray-700">
                <span className="text-[9px] font-bold">{new Date(member.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL BALANCE CARD */}
        <div className="bg-gradient-to-br from-[#6D0000] to-[#400000] rounded-[22px] p-5 relative overflow-hidden shadow-[0_10px_25px_rgba(109,0,0,0.3)] min-h-[220px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          {/* Top Section */}
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-white/80 text-xs font-medium tracking-wide mb-1 flex items-center gap-1.5">
                Total Balance (Live)
              </p>
              <h2 className="text-[32px] font-black text-white tracking-tight leading-none mb-1.5 flex items-start gap-1">
                <span className="text-xl mt-1 opacity-90">₹</span>
                {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[#D4AF37] text-[10px] font-semibold italic opacity-90 capitalize">
                {numberToWords(totalBalance)}
              </p>
            </div>
            
            {/* 3D Gold Piggy Bank styling */}
            <div className="relative mt-2 mr-2">
              <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-40 rounded-full scale-150"></div>
              <PiggyBank className="w-16 h-16 text-[#F9E596] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative z-10" fill="currentColor" strokeWidth={1} />
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-4"></div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end z-10 relative">
            <div>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider mb-0.5">Account No.</p>
              <div className="flex items-center gap-1.5">
                <p className="text-white font-mono font-bold tracking-widest text-sm">{member.id.replace('member-', '5010')}</p>
                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center text-[#D4AF37] bg-white/5 backdrop-blur cursor-pointer hover:bg-white/10 transition">
                  <FileText className="w-3 h-3" />
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center justify-end gap-1.5">
                 <Landmark className="w-3 h-3 text-[#D4AF37]" /> Commitment
              </p>
              <p className="text-white font-bold text-sm tracking-wide">₹{member.monthlyDeposit} / Month</p>
            </div>
          </div>
        </div>

        {/* STATISTICS CARDS (3 Equal Cards) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Deposit */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(34,197,94,0.12)] border border-green-100">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-2">
              <Download className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Total Deposit</p>
            <p className="font-bold text-gray-900 text-sm">₹ {totalBalance.toLocaleString('en-IN')}</p>
          </div>

          {/* Interest Earned */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(249,115,22,0.12)] border border-orange-100">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Interest Earned</p>
            <p className="font-bold text-gray-900 text-sm">₹ {interestEarned.toLocaleString('en-IN')}</p>
          </div>

          {/* Last Transaction */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(59,130,246,0.12)] border border-blue-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Last Trxn</p>
            <p className="font-bold text-blue-700 text-[11px] leading-tight">
              {lastTransaction ? (lastTransaction.date || 'No Data') : 'No Data'}
            </p>
          </div>
        </div>

        {/* QUICK SERVICES & LINKS */}
        <div className="pt-2">
          <h3 className="font-bold text-[13px] text-gray-900 mb-3 px-1">Quick Links</h3>
          
          <div className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50">
            
            {/* PASSBOOK BUTTON -> Opens single sheet Passbook for THIS member */}
            <button 
              onClick={() => setViewingPassbook(true)} 
              className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Passbook</h4>
                  <p className="text-[10px] text-gray-500">View passbook statement for {member.name}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            
            {/* DOWNLOAD STATEMENT BUTTON */}
            <button 
              onClick={handleDownloadMemberPDF} 
              className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Download Statement</h4>
                  <p className="text-[10px] text-gray-500">Download account PDF statement</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            {/* INTEREST HISTORY BUTTON */}
            <button onClick={() => navigate('/reports')} className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Interest History</h4>
                  <p className="text-[10px] text-gray-500">Track all interest payments</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            {/* LOAN DETAILS BUTTON */}
            <button onClick={() => navigate('/loans')} className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Loan Details</h4>
                  <p className="text-[10px] text-gray-500">View active & past loans</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            
            {/* ACCOUNT SETTINGS BUTTON */}
            <button onClick={() => navigate('/more')} className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Account Settings</h4>
                  <p className="text-[10px] text-gray-500">Manage member preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
