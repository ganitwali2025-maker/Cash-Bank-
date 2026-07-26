import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Undo2, 
  ReceiptIndianRupee, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Member, Loan, Emi, LanguageType } from '../types';
import { translations } from '../translations';
import { formatMonthLabel } from './Header';

interface EmiPaymentsTabProps {
  members: Member[];
  loans: Loan[];
  selectedMonth: string; // YYYY-MM
  language: LanguageType;
  onRecordEmiPayment: (loanId: string, emiNumber: number, date: string) => void;
  onUndoEmiPayment: (loanId: string, emiNumber: number) => void;
  onNavigateToMember: (memberId: string) => void;
}

export default function EmiPaymentsTab({
  members,
  loans,
  selectedMonth,
  language,
  onRecordEmiPayment,
  onUndoEmiPayment,
  onNavigateToMember
}: EmiPaymentsTabProps) {
  const t = translations[language];

  // Compile all EMIs due in this selected month
  const currentMonthEmis: { 
    loan: Loan; 
    emi: Emi; 
    memberName: string;
    phone: string;
  }[] = [];

  loans.forEach(loan => {
    const member = members.find(m => m.id === loan.memberId);
    loan.emis.forEach(emi => {
      if (emi.monthKey === selectedMonth) {
        currentMonthEmis.push({
          loan,
          emi,
          memberName: member ? member.name : `Member ${loan.memberId}`,
          phone: member ? member.phone : ''
        });
      }
    });
  });

  // Calculate totals
  const totalPrincipalDue = currentMonthEmis.reduce((sum, item) => sum + item.emi.principalComponent, 0);
  const totalInterestDue = currentMonthEmis.reduce((sum, item) => sum + item.emi.interestComponent, 0);
  const totalRepaymentDue = totalPrincipalDue + totalInterestDue;

  const totalCollected = currentMonthEmis
    .filter(item => item.emi.status === 'Paid')
    .reduce((sum, item) => sum + item.emi.totalAmount, 0);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* STICKY TOP CONTROLS */}
      <div className="sticky top-24 md:top-16 z-40 bg-[#FAF8F5] pt-2 pb-4 -mx-2 px-2 sm:-mx-0 sm:px-0 space-y-6">
        {/* Heading Banner */}
        <div className="bg-[#4a0404] text-[#fdfbf7] p-6 rounded border-b-2 border-[#c5a059] shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
          <div>
            <h1 className="text-xl sm:text-2xl tracking-[0.1em] font-black uppercase font-display text-[#c5a059]">
              {formatMonthLabel(selectedMonth, language)} — {t.emiPayments}
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-[#fdfbf7]/80 mt-1 font-sans">{t.emisSubtitle}</p>
          </div>

          {/* Aggregated Totals Bar */}
          <div className="bg-[#faf5eb]/10 border border-[#c5a059]/20 rounded p-3 shrink-0 flex items-center gap-4 text-xs sm:text-sm font-bold text-[#faf5eb]">
            <div className="text-center md:text-right">
              <p className="text-[9px] uppercase tracking-wider text-[#fdfbf7]/60 leading-none">{language === 'hi' ? 'कुल संकलित' : 'Total Collected'}</p>
              <p className="text-base font-bold font-serif text-[#c5a059] mt-0.5">₹{totalCollected.toLocaleString('en-IN')}</p>
            </div>
            <div className="h-8 w-px bg-[#c5a059]/30"></div>
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#fdfbf7]/60 leading-none">{t.totalDue}</p>
              <p className="text-base font-bold font-serif mt-0.5 text-[#fdfbf7]">₹{totalRepaymentDue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Dues Details Micro Indicators */}
        {currentMonthEmis.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,110px),1fr))] gap-4">
            <div className="bg-white p-3 rounded border-l-4 border-[#4a0404] shadow-sm">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'कुल देय मूलधन' : 'Total Due Principal'}</p>
              <p className="font-bold mt-1 text-gray-800 text-sm sm:text-base font-mono">₹{totalPrincipalDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-[#c5a059] shadow-sm">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'कुल देय ब्याज' : 'Total Due Interest'}</p>
              <p className="font-bold mt-1 text-amber-800 text-sm sm:text-base font-mono">₹{totalInterestDue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-[#4a0404] shadow-sm">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'कुल देय राशि' : 'Total Due Amount'}</p>
              <p className="font-bold mt-1 text-[#4a0404] text-sm sm:text-base font-mono">₹{totalRepaymentDue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>

      {/* EMI Master List Table */}
      <div className="bg-white rounded border border-[#c5a059]/20 shadow-sm overflow-hidden">
        {currentMonthEmis.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <ReceiptIndianRupee className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="font-bold uppercase text-xs tracking-wider">{language === 'hi' ? 'इस महीने कोई EMI देय नहीं है' : 'No EMI due payments in this month'}</p>
            <p className="text-[10px] text-gray-400 mt-1 font-sans">{language === 'hi' ? 'सभी ऋणों की किस्तें चुकता या लंबित नहीं हैं' : 'No member loans have schedules for this month'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#faf5eb]/50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 font-sans">
                  <th className="p-4">{t.memberName}</th>
                  <th className="p-4">{language === 'hi' ? 'ऋण / किस्त विवरण' : 'Loan / EMI No.'}</th>
                  <th className="p-4 font-mono">{t.principal}</th>
                  <th className="p-4 font-mono">{t.interest}</th>
                  <th className="p-4 font-mono">{t.total}</th>
                  <th className="p-4">{t.status}</th>
                  <th className="p-4 text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                {currentMonthEmis.map(({ loan, emi, memberName, phone }) => {
                  const isPaid = emi.status === 'Paid';
                  return (
                    <tr key={emi.id} className="hover:bg-[#faf5eb]/20 transition-colors">
                      {/* Name */}
                      <td className="p-4 font-sans font-bold text-gray-800">
                        <div 
                          className="cursor-pointer hover:text-[#4a0404] hover:underline"
                          onClick={() => onNavigateToMember(loan.memberId)}
                        >
                          {memberName}
                        </div>
                        <span className="text-[10px] text-gray-400 font-normal font-mono block mt-0.5">
                          {phone}
                        </span>
                      </td>

                      {/* EMI # */}
                      <td className="p-4 font-sans">
                        <span className="text-xs font-bold text-gray-700">
                          ₹{loan.principal.toLocaleString('en-IN')} ({loan.interestRate}%)
                        </span>
                        <span className="text-[9px] bg-[#c5a059]/20 text-[#4a0404] px-1.5 py-0.5 rounded font-bold font-mono block w-fit mt-1">
                          {t.emiNumberShort}{emi.emiNumber} {t.of} {loan.durationMonths}
                        </span>
                      </td>

                      {/* Principal Portion */}
                      <td className="p-4 font-bold text-gray-700">
                        ₹{emi.principalComponent.toLocaleString('en-IN')}
                      </td>

                      {/* Interest Portion */}
                      <td className="p-4 text-amber-800 font-bold">
                        ₹{emi.interestComponent.toLocaleString('en-IN')}
                      </td>

                      {/* Total EMI */}
                      <td className="p-4 text-base font-bold text-[#4a0404]">
                        ₹{emi.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="p-4 font-sans">
                        {isPaid ? (
                          <div className="flex flex-col">
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {t.paid}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono mt-0.5">
                              {emi.paymentDate}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            {t.pending}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right font-sans">
                        {isPaid ? (
                          <button
                            onClick={() => onUndoEmiPayment(loan.id, emi.emiNumber)}
                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded border border-rose-100 shadow-sm transition-all"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            {t.undo}
                          </button>
                        ) : (
                          <button
                            onClick={() => onRecordEmiPayment(loan.id, emi.emiNumber, todayStr)}
                            className="text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-all"
                          >
                            {t.payEmi}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
