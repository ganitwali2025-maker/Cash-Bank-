import React, { useState } from 'react';
import { 
  HandCoins, 
  UserPlus, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Undo2, 
  Layers,
  X,
  Sparkles,
  Percent
} from 'lucide-react';
import { Member, Loan, Emi, LanguageType } from '../types';
import { translations } from '../translations';
import { generateEmiSchedule } from '../utils/loanCalc';
import { formatMonthLabel } from './Header';

interface LoansTabProps {
  members: Member[];
  loans: Loan[];
  language: LanguageType;
  selectedMonth: string; // YYYY-MM
  onAddLoan: (loan: Loan) => void;
  onRecordEmiPayment: (loanId: string, emiNumber: number, date: string) => void;
  onUndoEmiPayment: (loanId: string, emiNumber: number) => void;
  onNavigateToMember: (memberId: string) => void;
}

export default function LoansTab({
  members,
  loans,
  language,
  selectedMonth,
  onAddLoan,
  onRecordEmiPayment,
  onUndoEmiPayment,
  onNavigateToMember
}: LoansTabProps) {
  const t = translations[language];

  // UI States
  const [showNewLoanForm, setShowNewLoanForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'closed'>('all');
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);

  // New Loan Form States
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [principal, setPrincipal] = useState(10000);
  const [interestRate, setInterestRate] = useState(2); // 2% per month
  const [durationMonths, setDurationMonths] = useState(6);
  const [startMonthKey, setStartMonthKey] = useState(selectedMonth);
  const [dateIssued, setDateIssued] = useState(new Date().toISOString().split('T')[0]);

  // Form Submission
  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || principal <= 0 || durationMonths <= 0) return;

    const loanId = `loan-${Date.now()}`;
    const generatedEmis = generateEmiSchedule(
      loanId,
      selectedMemberId,
      principal,
      interestRate,
      durationMonths,
      startMonthKey
    );

    const newLoan: Loan = {
      id: loanId,
      memberId: selectedMemberId,
      principal,
      interestRate,
      durationMonths,
      startMonthKey,
      dateIssued,
      status: 'Active',
      emis: generatedEmis
    };

    onAddLoan(newLoan);
    
    // Reset Form
    setSelectedMemberId('');
    setPrincipal(10000);
    setInterestRate(2);
    setDurationMonths(6);
    setShowNewLoanForm(false);
  };

  // Preview EMIs dynamically inside the form
  const previewEmis = selectedMemberId 
    ? generateEmiSchedule('preview', selectedMemberId, principal, interestRate, durationMonths, startMonthKey)
    : [];

  const previewTotalInterest = previewEmis.reduce((sum, e) => sum + e.interestComponent, 0);
  const previewTotalRepayment = principal + previewTotalInterest;

  // Filtered Loans
  const filteredLoans = loans.filter(l => {
    if (filterType === 'active') return l.status === 'Active';
    if (filterType === 'closed') return l.status === 'Closed';
    return true;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Heading Banner */}
      <div className="bg-[#4a0404] text-[#fdfbf7] p-6 rounded border-b-2 border-[#c5a059] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        <div>
          <h1 className="text-xl sm:text-2xl tracking-[0.1em] font-black uppercase font-display text-[#c5a059]">{t.loans}</h1>
          <p className="text-[10px] uppercase tracking-wider text-[#fdfbf7]/80 mt-1 font-sans">{t.loansSubtitle}</p>
        </div>

        <button
          onClick={() => setShowNewLoanForm(!showNewLoanForm)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-[#c5a059] hover:bg-[#d4af37] text-[#4a0404] px-4 py-2.5 rounded shadow transition-all self-start sm:self-auto hover:scale-[1.02]"
        >
          {showNewLoanForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showNewLoanForm ? t.cancel : t.giveNewLoan}
        </button>
      </div>

      {/* NEW LOAN FORM BLOCK */}
      {showNewLoanForm && (
        <div className="bg-white rounded border border-[#c5a059]/40 p-6 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Inputs */}
          <form onSubmit={handleCreateLoan} className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#4a0404] font-display border-b border-gray-100 pb-2">
              {t.giveNewLoan}
            </h3>

            {/* Member Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.selectMember}</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404] bg-white"
                required
              >
                <option value="">-- {t.selectMember} --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Loan Principal input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.loanAmount}</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min="1000"
                step="500"
                className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                required
              />
            </div>

            {/* Interest rate per month */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between">
                <span>{t.interestRate}</span>
                <span className="text-[#4a0404] font-black">{interestRate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#4a0404]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1 mt-0.5 font-mono">
                <span>1%</span>
                <span>2.5%</span>
                <span>5%</span>
                <span>7.5%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Duration and start dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.duration}</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                  required
                >
                  {[3, 4, 5, 6, 8, 10, 12, 18, 24].map(m => (
                    <option key={m} value={m}>{m} {language === 'hi' ? 'महीने' : 'Months'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">{t.startMonth}</label>
                <input
                  type="month"
                  value={startMonthKey}
                  onChange={(e) => setStartMonthKey(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.dateIssued}</label>
              <input
                type="date"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full text-sm px-3 py-1.5 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4a0404] hover:bg-[#2d0202] text-[#fdfbf7] text-[11px] uppercase tracking-wider font-bold rounded transition-all shadow-sm"
            >
              {language === 'hi' ? 'ऋण स्वीकृत करें' : 'Sanction Loan'}
            </button>
          </form>

          {/* Right Form: Realtime Schedule Preview */}
          <div className="lg:col-span-7 bg-[#faf5eb]/40 p-5 rounded border border-[#c5a059]/20 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 text-[#4a0404] font-display">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                {language === 'hi' ? 'किस्त शेड्यूल पूर्वावलोकन' : 'Installment Schedule Preview'}
              </h4>

              {selectedMemberId ? (
                <div className="space-y-4">
                  {/* Summary metric pill */}
                  <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded border border-[#c5a059]/20 text-[11px] font-semibold">
                    <div>
                      <p className="text-gray-400 uppercase text-[9px]">{language === 'hi' ? 'मूलधन स्वीकृत' : 'Sanctioned Principal'}</p>
                      <p className="font-bold text-gray-800 font-mono mt-0.5">₹{principal.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[9px]">{language === 'hi' ? 'कुल अनुमानित ब्याज' : 'Total Est. Interest'}</p>
                      <p className="font-bold text-amber-800 font-mono mt-0.5">₹{previewTotalInterest.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase text-[9px]">{language === 'hi' ? 'कुल देय राशि' : 'Total Repayment'}</p>
                      <p className="font-bold text-emerald-800 font-mono mt-0.5">₹{previewTotalRepayment.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Micro list of generated EMIs */}
                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#faf5eb]/50 sticky top-0 border-b border-gray-200 font-bold text-gray-600">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">{t.month}</th>
                          <th className="p-2 font-mono">{t.principal}</th>
                          <th className="p-2 font-mono">{t.interest}</th>
                          <th className="p-2 font-mono">{t.total}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono">
                        {previewEmis.map(emi => (
                          <tr key={emi.id} className="hover:bg-[#faf5eb]/20">
                            <td className="p-2 font-bold text-gray-600">#{emi.emiNumber}</td>
                            <td className="p-2 font-sans text-gray-700">{formatMonthLabel(emi.monthKey, language)}</td>
                            <td className="p-2">₹{emi.principalComponent.toLocaleString('en-IN')}</td>
                            <td className="p-2">₹{emi.interestComponent.toLocaleString('en-IN')}</td>
                            <td className="p-2 font-bold text-[#4a0404]">₹{emi.totalAmount.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 italic">
                    * {language === 'hi' 
                      ? 'ब्याज की गणना प्रत्येक महीने की शुरुआत में बचे हुए बकाया मूलधन पर की जाती है (घटता हुआ ब्याज)।' 
                      : 'Interest is calculated on the reducing outstanding principal at the beginning of each installment month.'}
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-16 text-gray-400 text-sm">
                  <Layers className="w-10 h-10 text-gray-300 mb-2" />
                  <p className="font-bold uppercase text-xs tracking-wider">{language === 'hi' ? 'पूर्वावलोकन देखने के लिए सदस्य चुनें' : 'Select a member to see preview'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FILTER TABS FOR EXISTING LOANS */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex bg-[#faf5eb] p-1 rounded text-xs font-bold text-gray-600 border border-[#c5a059]/15">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded transition-all uppercase tracking-wider text-[10px] ${filterType === 'all' ? 'bg-[#4a0404] text-white shadow' : 'hover:text-gray-900'}`}
          >
            {language === 'hi' ? 'सभी लोन' : 'All Loans'}
          </button>
          <button
            onClick={() => setFilterType('active')}
            className={`px-3 py-1.5 rounded transition-all uppercase tracking-wider text-[10px] ${filterType === 'active' ? 'bg-[#4a0404] text-white shadow' : 'hover:text-[#4a0404]'}`}
          >
            {language === 'hi' ? 'सक्रिय' : 'Active'}
          </button>
          <button
            onClick={() => setFilterType('closed')}
            className={`px-3 py-1.5 rounded transition-all uppercase tracking-wider text-[10px] ${filterType === 'closed' ? 'bg-[#4a0404] text-white shadow' : 'hover:text-[#4a0404]'}`}
          >
            {language === 'hi' ? 'पूर्ण' : 'Closed'}
          </button>
        </div>
        
        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
          {filteredLoans.length} {language === 'hi' ? 'लोन स्वीकृत' : 'loans found'}
        </span>
      </div>

      {/* LOANS LIST GRID */}
      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <div className="bg-white rounded p-12 text-center text-gray-400 border border-gray-100">
            <HandCoins className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="font-bold uppercase text-xs tracking-wider">{language === 'hi' ? 'कोई ऋण रिकॉर्ड नहीं मिला' : 'No loans records found'}</p>
          </div>
        ) : (
          filteredLoans.map(loan => {
            const member = members.find(m => m.id === loan.memberId);
            const isExpanded = expandedLoanId === loan.id;

            // Stats
            const totalEmis = loan.durationMonths;
            const paidEmis = loan.emis.filter(e => e.status === 'Paid').length;
            const pctCompleted = Math.round((paidEmis / totalEmis) * 100);

            // Sum paid principal & interest
            const principalPaid = loan.emis.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.principalComponent, 0);
            const interestPaid = loan.emis.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.interestComponent, 0);
            const outstanding = Math.max(0, loan.principal - principalPaid);

            return (
              <div 
                key={loan.id} 
                className="bg-white rounded border border-[#c5a059]/20 shadow-sm overflow-hidden animate-fade-in"
              >
                {/* Loan Header Row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#faf5eb]/20 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 
                        className="font-bold text-gray-800 hover:text-[#4a0404] hover:underline cursor-pointer text-base"
                        onClick={() => onNavigateToMember(loan.memberId)}
                      >
                        {member ? member.name : `Member ${loan.memberId}`}
                      </h3>
                      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        loan.status === 'Active' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {loan.status === 'Active' ? t.active : t.closed}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-mono font-bold text-gray-500">
                      <span>{language === 'hi' ? 'लोन:' : 'Loan:'} ₹{loan.principal.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span>{language === 'hi' ? 'दर:' : 'Rate:'} {loan.interestRate}%</span>
                      <span>•</span>
                      <span>{loan.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}</span>
                    </div>
                  </div>

                  {/* Progress bar column */}
                  <div className="w-full md:w-56 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span>{language === 'hi' ? 'किश्त प्रगति' : 'EMI Progress'}</span>
                      <span className="font-mono">{paidEmis} / {totalEmis} ({pctCompleted}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#4a0404] h-full rounded-full" 
                        style={{ width: `${pctCompleted}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Right side expand trigger */}
                  <button
                    onClick={() => setExpandedLoanId(isExpanded ? null : loan.id)}
                    className="self-end md:self-auto py-1.5 px-3 rounded bg-gray-100 hover:bg-[#4a0404] hover:text-white text-[#4a0404] text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 border border-gray-200"
                  >
                    {isExpanded ? <EyeOff className="w-3.5 h-3.5 text-[#c5a059]" /> : <Eye className="w-3.5 h-3.5 text-[#c5a059]" />}
                    {isExpanded ? (language === 'hi' ? 'विवरण छुपाएं' : 'Hide Details') : (language === 'hi' ? 'EMI विवरण' : 'View Schedule')}
                  </button>
                </div>

                {/* Expanded EMI schedule table */}
                {isExpanded && (
                  <div className="bg-[#faf5eb]/30 border-t border-gray-150 p-5 space-y-4">
                    {/* Metrics grid inside loan */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'भुगतान किया मूलधन' : 'Paid Principal'}</p>
                        <p className="font-bold text-emerald-800 text-sm font-mono mt-1">₹{principalPaid.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'अर्जित ब्याज' : 'Interest Earned'}</p>
                        <p className="font-bold text-emerald-800 text-sm font-mono mt-1">₹{interestPaid.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{t.outstandingPrincipal}</p>
                        <p className="font-bold text-rose-800 text-sm font-mono mt-1">₹{outstanding.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-100">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{language === 'hi' ? 'शुरुआत महीना' : 'Starting Month'}</p>
                        <p className="font-bold text-gray-800 text-sm font-sans mt-1">
                          {formatMonthLabel(loan.startMonthKey, language)}
                        </p>
                      </div>
                    </div>

                    {/* EMI Table list */}
                    <div className="bg-white border border-[#c5a059]/25 rounded overflow-x-auto shadow-sm">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#faf5eb]/50 border-b border-gray-200 text-gray-600 font-bold">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">{t.month}</th>
                            <th className="p-3 font-mono">{t.principal}</th>
                            <th className="p-3 font-mono">{t.interest}</th>
                            <th className="p-3 font-mono">{t.total}</th>
                            <th className="p-3">{t.status}</th>
                            <th className="p-3 text-right">{t.action}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono">
                          {loan.emis.map(emi => {
                            const isPaid = emi.status === 'Paid';
                            return (
                              <tr key={emi.id} className="hover:bg-[#faf5eb]/10">
                                <td className="p-3 font-bold text-gray-700 font-sans">#{emi.emiNumber}</td>
                                <td className="p-3 font-sans font-bold text-gray-700">{formatMonthLabel(emi.monthKey, language)}</td>
                                <td className="p-3 font-mono">₹{emi.principalComponent.toLocaleString('en-IN')}</td>
                                <td className="p-3 font-mono">₹{emi.interestComponent.toLocaleString('en-IN')}</td>
                                <td className="p-3 font-bold text-[#4a0404]">₹{emi.totalAmount.toLocaleString('en-IN')}</td>
                                <td className="p-3 font-sans">
                                  {isPaid ? (
                                    <div className="flex flex-col">
                                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        {t.paid}
                                      </span>
                                      <span className="text-[9px] text-gray-400 mt-0.5 font-mono">
                                        {emi.paymentDate}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 w-fit font-sans">
                                      {t.pending}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right font-sans">
                                  {isPaid ? (
                                    <button
                                      onClick={() => onUndoEmiPayment(loan.id, emi.emiNumber)}
                                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 transition-colors"
                                    >
                                      <Undo2 className="w-3 h-3" />
                                      {t.undo}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => onRecordEmiPayment(loan.id, emi.emiNumber, todayStr)}
                                      className="text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white px-2.5 py-1.5 rounded transition-all shadow-sm"
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
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
