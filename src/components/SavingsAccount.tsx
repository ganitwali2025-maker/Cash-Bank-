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
  ChevronRight
} from 'lucide-react';
import { Member, Deposit, LanguageType } from '../types';

interface Props {
  members: Member[];
  deposits: Deposit[];
  language: LanguageType;
}

export default function SavingsAccount({ members, deposits, language }: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const member = members.find(m => m.id === id);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 font-sans">Member not found</p>
        <button onClick={() => navigate('/members')} className="mt-4 px-4 py-2 bg-[#5A0000] text-white rounded-lg">
          Go Back
        </button>
      </div>
    );
  }

  const memberDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
  const totalBalance = memberDeposits.reduce((sum, d) => sum + d.amount, 0);
  
  // Dummy interest calc for UI
  const interestEarned = totalBalance * 0.05;

  const lastTransaction = memberDeposits.length > 0 
    ? memberDeposits[memberDeposits.length - 1] 
    : null;

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">Savings Account</h1>
        </div>
        <button className="p-1 rounded-full hover:bg-white/10 transition">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 space-y-4 -mt-2">
        {/* Main Golden Card */}
        <div className="bg-[#FDF3D0] rounded-[24px] p-5 shadow-sm text-[#4a0404] relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold tracking-[0.1em] uppercase opacity-90 mb-1">Savings Account</p>
              <h2 className="text-3xl font-black font-serif mb-1">₹ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
              <p className="text-[10px] font-medium opacity-80">Total Balance</p>
            </div>
            <div className="text-[#D4AF37] opacity-90 mt-1">
              <PiggyBank className="w-14 h-14" fill="currentColor" />
            </div>
          </div>
          
          <div className="flex items-end justify-between border-t border-[#D4AF37]/30 pt-4">
            <div>
              <p className="text-[9px] font-medium opacity-80">Account No.</p>
              <p className="font-bold font-serif text-[11px] tracking-widest">{member.id.replace('member-', '5010')}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-medium opacity-80">Member Name</p>
              <p className="font-bold text-[11px]">{member.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-[20px] p-4 flex flex-col justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <Download className="w-3.5 h-3.5" />
              </div>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Total Deposit</p>
            </div>
            <p className="font-bold text-gray-900 text-lg ml-1">₹{totalBalance.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="bg-white rounded-[20px] p-4 flex flex-col justify-center gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Interest Earned</p>
            </div>
            <p className="font-bold text-gray-900 text-lg ml-1">₹{interestEarned.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Recent Transaction Mini */}
        {lastTransaction && (
          <div className="bg-white rounded-[20px] p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
            <div>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">Last Transaction</p>
              <p className="text-sm font-bold text-gray-800">{new Date(lastTransaction.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">Deposit</p>
              <p className="text-sm font-bold text-green-600">+₹{lastTransaction.amount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="pt-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800 mb-3 px-1">Quick Links</h3>
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-gray-700">Mini Statement</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Book className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-gray-700">Passbook</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <Download className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-gray-700">Download Statement</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
