import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical,
  Landmark,
  History,
  Info,
  ChevronRight
} from 'lucide-react';
import { Member, Loan, LanguageType } from '../types';

interface Props {
  members: Member[];
  loans: Loan[];
  language: LanguageType;
}

export default function MyLoan({ members, loans, language }: Props) {
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

  // Get first active loan or last loan
  const activeLoans = loans.filter(l => l.memberId === member.id && l.status === 'Active');
  const loan = activeLoans.length > 0 ? activeLoans[0] : loans.find(l => l.memberId === member.id);

  if (!loan) {
    return (
      <div className="bg-[#FFFDF8] min-h-screen pb-24">
        <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">My Loan</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <Landmark className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-sans font-bold">No active loan found for {member.name}</p>
        </div>
      </div>
    );
  }

  const paidEmis = loan.emis.filter(e => e.status === 'Paid');
  const totalPaidPrincipal = paidEmis.reduce((sum, e) => sum + e.principalComponent, 0);
  const outstandingBalance = loan.principal - totalPaidPrincipal;
  const paidPercentage = Math.round((totalPaidPrincipal / loan.principal) * 100);

  // Next Due EMI
  const pendingEmis = loan.emis.filter(e => e.status === 'Pending').sort((a, b) => a.emiNumber - b.emiNumber);
  const nextEmi = pendingEmis.length > 0 ? pendingEmis[0] : null;

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">My Loan</h1>
        </div>
        <button className="p-1 rounded-full hover:bg-white/10 transition">
          <MoreVertical className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 space-y-4 -mt-2">
        {/* Main Loan Card */}
        <div className="bg-gradient-to-br from-[#FFF0F5] to-[#FFE4E1] rounded-[24px] p-5 shadow-[0_8px_30px_rgba(255,192,203,0.3)] border border-pink-100 relative overflow-hidden">
          <Landmark className="absolute right-4 top-4 w-12 h-12 text-[#5A0000]/20" />
          
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5A0000] mb-1">LOAN ACCOUNT</p>
          <h2 className="text-3xl font-black font-serif text-[#4a0404] mb-1">₹ {loan.principal.toLocaleString('en-IN')}</h2>
          <p className="text-[10px] font-medium text-gray-500 mb-6">Loan Amount</p>
          
          <div className="flex items-center justify-between border-t border-pink-200/50 pt-4">
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Outstanding Balance</p>
              <p className="font-bold font-serif text-sm text-[#4a0404]">₹ {outstandingBalance.toLocaleString('en-IN')}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Interest</p>
              <p className="font-bold text-sm text-[#4a0404]">{loan.interestRate}% p.a.</p>
            </div>
          </div>
        </div>

        {/* EMI Details Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">EMI Amount</p>
              <p className="font-bold text-sm text-gray-900">₹{nextEmi ? nextEmi.totalAmount.toLocaleString('en-IN') : '0'}</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">Next Due Date</p>
              <p className="font-bold text-xs text-gray-900">{nextEmi ? '05 Next Month' : 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-1">EMI Paid</p>
              <p className="font-bold text-sm text-green-600">{paidPercentage}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-end mb-1 text-[10px] font-bold text-gray-700">{paidPercentage}%</div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5A0000] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${paidPercentage}%` }}
              />
            </div>
          </div>

          <button className="w-full py-3.5 bg-[#5A0000] text-white rounded-[16px] font-bold uppercase tracking-wider text-xs hover:bg-[#4a0404] transition-colors shadow-md">
            Pay EMI Now
          </button>
        </div>

        {/* Action Links */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50 mt-2">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                <History className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-gray-700">Loan History</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                <Info className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-gray-700">Loan Details</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

      </div>
    </div>
  );
}
