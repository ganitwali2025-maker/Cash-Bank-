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
  Wallet,
  Landmark,
  Settings,
  Clock,
  ArrowRight,
  RefreshCw,
  Loader2
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

export default function SavingsAccount({ members, deposits, loans, language }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const member = members.find(m => m.id === id);

  const [sheetDeposits, setSheetDeposits] = useState<any[]>([]);
  const [loadingSheet, setLoadingSheet] = useState<boolean>(true);

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

  // Filter Google Sheet deposits for this member
  const memberSheetDeposits = sheetDeposits.filter(d => {
    if (!d) return false;
    const dMemId = String(d.memberId || '').toUpperCase();
    const targetId = String(member.id).toUpperCase();
    if (dMemId === targetId) return true;
    if (memberNum && (dMemId === `M00${memberNum}` || dMemId === `M0${memberNum}` || dMemId === `M${memberNum}`)) return true;
    if (d.name && d.name.toLowerCase().trim() === member.name.toLowerCase().trim()) return true;
    return false;
  });

  // Calculate live total balance
  const memberLocalDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
  
  const totalBalance = memberSheetDeposits.length > 0
    ? memberSheetDeposits.reduce((sum, d) => sum + Number(d.amount || 0), 0)
    : memberLocalDeposits.reduce((sum, d) => sum + d.amount, 0);

  const totalDepositsCount = memberSheetDeposits.length > 0
    ? memberSheetDeposits.length
    : memberLocalDeposits.length;

  const lastTransaction = memberSheetDeposits.length > 0
    ? memberSheetDeposits[memberSheetDeposits.length - 1]
    : (memberLocalDeposits.length > 0 ? memberLocalDeposits[memberLocalDeposits.length - 1] : null);

  const lastTxnDateStr = lastTransaction
    ? (lastTransaction.date || lastTransaction.timestamp || '—')
    : '—';

  // Active Status logic
  const memberLoans = loans.filter(l => l.memberId === member.id && l.status === 'Active');
  const isActive = totalBalance > 0 || memberLoans.length > 0;

  return (
    <div className="bg-[#FAF8F4] min-h-screen pb-24 font-sans">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#5A0000] to-[#7a0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md border-b-[3px] border-[#D4AF37]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">Member Profile</h1>
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
            <h2 className="text-[15px] font-black text-gray-900 uppercase tracking-wide truncate">{member.name}</h2>
            
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
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[9px] font-bold uppercase rounded flex items-center gap-1 border border-green-200">
              <ShieldCheck className="w-3 h-3" /> Active Member
            </span>
            
            <div className="text-right">
              <p className="text-[7px] text-gray-400 font-bold uppercase mb-0.5">Joined On</p>
              <div className="flex items-center justify-end gap-1 text-gray-700">
                <span className="text-[9px] font-bold">{new Date(member.joiningDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <Calendar className="w-3 h-3 text-[#D4AF37]" />
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL SAVINGS BALANCE CARD */}
        <div className="bg-gradient-to-br from-[#6D0000] to-[#400000] rounded-[22px] p-5 relative overflow-hidden shadow-[0_10px_25px_rgba(109,0,0,0.3)] min-h-[200px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          {/* Top Section */}
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <p className="text-white/80 text-xs font-medium tracking-wide mb-1 flex items-center gap-1.5">
                Total Savings Balance (Live)
              </p>
              <h2 className="text-[32px] font-black text-white tracking-tight leading-none mb-1.5 flex items-start gap-1">
                <span className="text-xl mt-1 opacity-90">₹</span>
                {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <p className="text-[#D4AF37] text-[10px] font-semibold italic opacity-90 capitalize">
                {numberToWords(totalBalance)}
              </p>
            </div>
            
            {/* 3D Gold Piggy Bank */}
            <div className="relative mt-2 mr-2">
              <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-40 rounded-full scale-150"></div>
              <PiggyBank className="w-14 h-14 text-[#F9E596] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] relative z-10" fill="currentColor" strokeWidth={1} />
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent my-3"></div>

          {/* Bottom Section */}
          <div className="flex justify-between items-end z-10 relative">
            <div>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-wider mb-0.5">Account No.</p>
              <div className="flex items-center gap-1.5">
                <p className="text-white font-mono font-bold tracking-widest text-sm">{member.id.replace('member-', '5010')}</p>
                <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center text-[#D4AF37] bg-white/5 backdrop-blur">
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
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-green-100">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-1.5">
              <Download className="w-4 h-4" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-0.5">Total Deposit</p>
            <p className="font-bold text-gray-900 text-xs">₹ {totalBalance.toLocaleString('en-IN')}</p>
          </div>

          {/* Deposits Count */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-purple-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-1.5">
              <Book className="w-4 h-4" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-0.5">Paid Months</p>
            <p className="font-bold text-gray-900 text-xs">{totalDepositsCount} Months</p>
          </div>

          {/* Outstanding Loan (Default 0) */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-blue-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1.5">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-0.5">Loan Balance</p>
            <p className="font-bold text-blue-700 text-xs">₹ 0</p>
          </div>
        </div>

        {/* LIVE GOOGLE SHEET DEPOSITS LIST FOR THIS MEMBER */}
        <div className="bg-white rounded-[22px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              Deposit History ({memberSheetDeposits.length || memberLocalDeposits.length})
            </h3>
            {loadingSheet && <Loader2 className="w-4 h-4 animate-spin text-[#5A0000]" />}
          </div>

          <div className="space-y-2">
            {memberSheetDeposits.length > 0 ? (
              memberSheetDeposits.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF8F4] rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{d.month || 'Deposit'}</p>
                    <p className="text-[10px] text-gray-500">{d.date || '—'} • {d.paymentMode || 'Cash'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-700">+₹{Number(d.amount).toLocaleString('en-IN')}</p>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full inline-block mt-0.5">
                      {d.status || 'Paid'}
                    </span>
                  </div>
                </div>
              ))
            ) : memberLocalDeposits.length > 0 ? (
              memberLocalDeposits.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF8F4] rounded-xl border border-gray-100">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{d.monthKey}</p>
                    <p className="text-[10px] text-gray-500">{d.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-700">+₹{d.amount.toLocaleString('en-IN')}</p>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full inline-block mt-0.5">
                      Paid
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-gray-400 font-medium">Koi deposit history nahi mili</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
