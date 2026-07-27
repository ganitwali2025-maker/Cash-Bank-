import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Member, Deposit, Loan, LanguageType } from '../types';
import { numberToWords } from '../utils/numberToWords';

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

  // Calculate Data
  const memberDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
  const totalBalance = memberDeposits.reduce((sum, d) => sum + d.amount, 0);
  const interestEarned = totalBalance * 0.05; // Dummy interest
  
  const lastTransaction = memberDeposits.length > 0 
    ? memberDeposits[memberDeposits.length - 1] 
    : null;

  // Active Status logic
  const memberLoans = loans.filter(l => l.memberId === member.id);
  const isActive = totalBalance > 0 || memberLoans.length > 0;

  // Find first pending EMI
  let firstPendingEmi = null;
  let activeLoan = null;
  for (const loan of memberLoans) {
    if (loan.status === 'Active') {
      const pendingEmi = loan.emis.find(e => e.status === 'Pending');
      if (pendingEmi) {
        firstPendingEmi = pendingEmi;
        activeLoan = loan;
        break; // Show only the first one
      }
    }
  }

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
        <button className="p-1.5 rounded-full hover:bg-white/10 transition">
          <MoreVertical className="w-6 h-6" />
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
              <span className="text-[9px] text-gray-800 font-bold">{member.id.replace('member-', '')}</span>
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
                Total Balance
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
                 <Landmark className="w-3 h-3 text-[#D4AF37]" /> Account Type
              </p>
              <p className="text-white font-bold text-sm tracking-wide">Savings Account</p>
            </div>
          </div>
        </div>

        {/* STATISTICS CARDS (3 Equal Cards) */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Deposit */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-2">
              <Download className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Total Deposit</p>
            <p className="font-bold text-gray-900 text-sm">₹ {totalBalance.toLocaleString('en-IN')}</p>
          </div>

          {/* Interest Earned */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Interest Earned</p>
            <p className="font-bold text-gray-900 text-sm">₹ {interestEarned.toLocaleString('en-IN')}</p>
          </div>

          {/* Last Transaction */}
          <div className="bg-white rounded-[22px] p-3.5 flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mb-1">Last Trxn</p>
            <p className="font-bold text-blue-700 text-[11px] leading-tight">
              {lastTransaction ? new Date(lastTransaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No Data'}
            </p>
          </div>
        </div>

        {/* PREMIUM EMI ALERT CARD */}
        {firstPendingEmi && activeLoan && (
          <div className="w-full bg-white rounded-[24px] p-4 sm:p-5 flex flex-col relative shadow-[0_8px_30px_rgba(109,0,0,0.12)] border border-red-50 overflow-hidden">


            {/* Top Row: Icon & Titles & Badge */}
            <div className="flex justify-between items-start pl-2">
              <div className="flex gap-3 items-center">
                {/* Glowing Bell */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-red-50 to-red-100 border border-red-100 flex items-center justify-center text-[#6D0000] shrink-0 relative shadow-[0_4px_15px_rgba(220,38,38,0.2)]">
                  <BellRing className="w-5 h-5" fill="currentColor" fillOpacity={0.2} />
                  <span className="absolute top-0 right-0 sm:top-1 sm:right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
                  <span className="absolute top-0 right-0 sm:top-1 sm:right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                
                <div>
                  <h3 className="text-[13px] sm:text-[15px] font-black text-[#6D0000] tracking-wide uppercase leading-tight">EMI Due Alert</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium mt-0.5">Loan EMI Pending</p>
                </div>
              </div>

              {/* Due Badge */}
              <div className="bg-red-50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 border border-red-100">
                <Clock className="w-3 h-3 text-[#6D0000]" />
                <span className="text-[8px] sm:text-[9px] font-bold text-[#6D0000] uppercase">Due Today</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gradient-to-r from-red-50 via-red-100 to-red-50 my-3 sm:my-4 pl-2"></div>

            {/* Bottom Section: Details then Button */}
            <div className="flex flex-col gap-4 pl-2 pr-2">
              <div className="flex items-center justify-center gap-8">
                {/* Due Date */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6D0000]" />
                    <p className="text-[10px] text-gray-500 font-medium">Due Date</p>
                  </div>
                  <p className="text-[13px] font-bold text-gray-900">{firstPendingEmi.monthKey}-10</p>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-8 bg-red-100"></div>

                {/* Amount */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Wallet className="w-3.5 h-3.5 text-[#6D0000]" />
                    <p className="text-[10px] text-gray-500 font-medium">EMI Amount</p>
                  </div>
                  <p className="text-[15px] font-black text-[#6D0000]">₹{firstPendingEmi.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Pay Now Button */}
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#6D0000] to-[#A30000] text-white text-[13px] font-bold rounded-xl shadow-[0_8px_15px_rgba(109,0,0,0.3)] hover:scale-[1.02] transition-transform">
                PAY NOW <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* QUICK SERVICES */}
        <div className="pt-2">
          <h3 className="font-bold text-[13px] text-gray-900 mb-3 px-1">Quick Links</h3>
          
          <div className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50">
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Mini Statement</h4>
                  <p className="text-[10px] text-gray-500">View recent transactions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Passbook</h4>
                  <p className="text-[10px] text-gray-500">View passbook transactions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Download Statement</h4>
                  <p className="text-[10px] text-gray-500">Download account statement</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Interest History</h4>
                  <p className="text-[10px] text-gray-500">Track all interest payments</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-[13px] text-gray-900 mb-0.5">Loan Details</h4>
                  <p className="text-[10px] text-gray-500">View active & past loans</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-[#FAF8F4] transition-colors group">
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
