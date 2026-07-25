import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Undo2, 
  Calendar, 
  Coins, 
  CalendarDays,
  Check
} from 'lucide-react';
import { Member, Deposit, LanguageType } from '../types';
import { translations } from '../translations';
import { formatMonthLabel } from './Header';

interface MonthlyDepositsTabProps {
  members: Member[];
  deposits: Deposit[];
  selectedMonth: string; // YYYY-MM
  language: LanguageType;
  onRecordDeposit: (memberId: string, amount: number, date: string, monthKey: string) => void;
  onUndoDepositSpecific: (depositId: string) => void;
}

export default function MonthlyDepositsTab({
  members,
  deposits,
  selectedMonth,
  language,
  onRecordDeposit,
  onUndoDepositSpecific
}: MonthlyDepositsTabProps) {
  const t = translations[language];

  // Inline recording state per member
  const [recordingMemberId, setRecordingMemberId] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState(1000);
  const [customDate, setCustomDate] = useState('');

  // Calculations for current month
  const currentMonthDeposits = deposits.filter(d => d.monthKey === selectedMonth && d.status === 'Paid');
  const totalCollectedThisMonth = currentMonthDeposits.reduce((sum, d) => sum + d.amount, 0);
  const expectedThisMonth = members.reduce((sum, m) => sum + m.monthlyDeposit, 0);

  const startRecordPayment = (member: Member) => {
    setRecordingMemberId(member.id);
    setCustomAmount(member.monthlyDeposit);
    setCustomDate(new Date().toISOString().split('T')[0]);
  };

  const submitPayment = (memberId: string) => {
    onRecordDeposit(memberId, customAmount, customDate || new Date().toISOString().split('T')[0], selectedMonth);
    setRecordingMemberId(null);
  };

  return (
    <div className="space-y-6">
      {/* STICKY TOP CONTROLS */}
      <div className="sticky top-24 md:top-16 z-40 bg-[#FAF8F5] pt-2 pb-4 -mx-2 px-2 sm:-mx-0 sm:px-0 space-y-6">
        {/* Title Banner */}
        <div className="bg-[#4a0404] text-[#fdfbf7] p-6 rounded border-b-2 border-[#c5a059] shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
          <div>
            <h1 className="text-xl sm:text-2xl tracking-[0.1em] font-black uppercase font-display text-[#c5a059]">
              {formatMonthLabel(selectedMonth, language)} — {t.monthlyDeposits}
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-[#fdfbf7]/80 mt-1 font-sans">{t.depositsSubtitle}</p>
          </div>

          {/* Month Progress Info card */}
          <div className="bg-[#faf5eb]/10 border border-[#c5a059]/20 rounded p-3 shrink-0 flex items-center gap-4 text-sm font-bold text-[#faf5eb]">
            <div className="text-center md:text-right">
              <p className="text-[9px] uppercase tracking-wider text-[#fdfbf7]/60 leading-none">{language === 'hi' ? 'कुल एकत्रित' : 'Total Collected'}</p>
              <p className="text-lg font-bold font-serif text-[#c5a059] mt-0.5">₹{totalCollectedThisMonth.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-8 w-px bg-[#c5a059]/30"></div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#fdfbf7]/60 leading-none">{language === 'hi' ? 'अपेक्षित कुल' : 'Expected Total'}</p>
              <p className="text-lg font-bold font-serif mt-0.5 text-[#fdfbf7]">₹{expectedThisMonth.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Deposits Register List */}
      <div className="bg-white rounded border border-[#c5a059]/20 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#faf5eb]/50 border-b border-gray-100 hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-[#4a0404]/70 font-sans">
          <div className="sm:col-span-4">{t.memberName}</div>
          <div className="sm:col-span-2 font-mono">{language === 'hi' ? 'अपेक्षित बचत' : 'Expected Savings'}</div>
          <div className="sm:col-span-2">{t.status}</div>
          <div className="sm:col-span-2">{language === 'hi' ? 'जमा तारीख / विवरण' : 'Date / Details'}</div>
          <div className="sm:col-span-2 text-right">{t.action}</div>
        </div>

        <div className="divide-y divide-gray-100">
          {members.map(member => {
            const deposit = deposits.find(d => d.memberId === member.id && d.monthKey === selectedMonth);
            const isPaid = deposit && deposit.status === 'Paid';
            const isRecording = recordingMemberId === member.id;

            return (
              <div key={member.id} className="p-4 sm:grid sm:grid-cols-12 gap-2 items-center hover:bg-[#faf5eb]/40 transition-colors">
                
                {/* Member Name */}
                <div className="sm:col-span-4 mb-2 sm:mb-0">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base">{member.name}</h4>
                  <p className="text-[11px] text-gray-500 font-mono sm:hidden mt-0.5">
                    {language === 'hi' ? 'अपेक्षित' : 'Expected'}: ₹{member.monthlyDeposit.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Expected savings amount */}
                <div className="sm:col-span-2 hidden sm:block font-bold text-gray-700 font-mono text-sm">
                  ₹{member.monthlyDeposit.toLocaleString('en-IN')}
                </div>

                {/* Status Badge */}
                <div className="sm:col-span-2 mb-2 sm:mb-0">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.paid}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                      <XCircle className="w-3 h-3 text-rose-500" />
                      {t.pending}
                    </span>
                  )}
                </div>

                {/* Payment date / inline fields */}
                <div className="sm:col-span-2 mb-3 sm:mb-0 text-sm">
                  {isPaid ? (
                    <div className="text-gray-600 flex items-center gap-1 text-[10px] font-mono font-bold bg-gray-50 px-2 py-0.5 rounded w-fit border border-gray-100">
                      <CalendarDays className="w-3 h-3 text-gray-400" />
                      {deposit.date}
                    </div>
                  ) : isRecording ? (
                    <div className="space-y-2 max-w-xs bg-gray-50 p-2.5 rounded border border-[#c5a059]/30">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">{language === 'hi' ? 'जमा राशि (₹)' : 'Amount (₹)'}</label>
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(Number(e.target.value))}
                          className="w-full text-xs font-bold px-2 py-1 rounded border border-gray-300 mt-0.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-wider">{language === 'hi' ? 'जमा तारीख' : 'Payment Date'}</label>
                        <input
                          type="date"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-full text-xs px-2 py-1 rounded border border-gray-300 mt-0.5 font-mono focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">—</span>
                  )}
                </div>

                {/* Actions column */}
                <div className="sm:col-span-2 text-right">
                  {isPaid ? (
                    <button
                      onClick={() => onUndoDepositSpecific(deposit.id)}
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded border border-rose-100 shadow-sm transition-all"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      {t.undo}
                    </button>
                  ) : isRecording ? (
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => submitPayment(member.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded shadow transition-colors"
                        title={t.save}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRecordingMemberId(null)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded transition-colors text-xs font-bold"
                      >
                        X
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startRecordPayment(member)}
                      className="text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
                    >
                      {t.recordPayment}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
