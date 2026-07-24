import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Calendar, 
  PiggyBank, 
  HandCoins, 
  ArrowLeft, 
  Edit2, 
  CheckCircle2, 
  Undo2, 
  Plus,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { Member, Deposit, Loan, Emi, LanguageType } from '../types';
import { translations } from '../translations';
import { generateEmiSchedule } from '../utils/loanCalc';
import { formatMonthLabel } from './Header';

interface MembersTabProps {
  members: Member[];
  deposits: Deposit[];
  loans: Loan[];
  language: LanguageType;
  selectedMonth: string;
  onUpdateMember: (member: Member) => void;
  onAddMember: (member: Member) => void;
  onRecordDeposit: (memberId: string, amount: number, date: string, monthKey: string) => void;
  onUndoDepositSpecific: (depositId: string) => void;
  onRecordEmiPayment: (loanId: string, emiNumber: number, date: string) => void;
  onUndoEmiPayment: (loanId: string, emiNumber: number) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
}

export default function MembersTab({
  members,
  deposits,
  loans,
  language,
  selectedMonth,
  onUpdateMember,
  onAddMember,
  onRecordDeposit,
  onUndoDepositSpecific,
  onRecordEmiPayment,
  onUndoEmiPayment,
  selectedMemberId,
  setSelectedMemberId
}: MembersTabProps) {
  const t = translations[language];

  // Search & Navigation States
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Edit / Add Form Local States
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeposit, setFormDeposit] = useState(1000);
  const [formDate, setFormDate] = useState('2026-01-01');

  // Profile Specific Tab
  const [profileTab, setProfileTab] = useState<'savings' | 'loans'>('savings');

  // Filters members list
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const selectedMember = members.find(m => m.id === selectedMemberId);

  // Open Edit Form
  const handleOpenEdit = (m: Member) => {
    setFormName(m.name);
    setFormPhone(m.phone);
    setFormDeposit(m.monthlyDeposit);
    setFormDate(m.joiningDate);
    setIsEditing(true);
  };

  // Save Edit Form
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    if (!formName.trim() || !formPhone.trim()) return;

    onUpdateMember({
      id: selectedMemberId,
      name: formName,
      phone: formPhone,
      monthlyDeposit: Number(formDeposit),
      joiningDate: formDate
    });
    setIsEditing(false);
  };

  // Open Add Form
  const handleOpenAdd = () => {
    setFormName('');
    setFormPhone('');
    setFormDeposit(1000);
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsAdding(true);
  };

  // Save Add Form
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: formName,
      phone: formPhone,
      monthlyDeposit: Number(formDeposit),
      joiningDate: formDate
    };

    onAddMember(newMember);
    setIsAdding(false);
  };

  // Calculations for selected member profile
  const memberDeposits = selectedMember 
    ? deposits.filter(d => d.memberId === selectedMember.id) 
    : [];
  
  const memberTotalSavings = memberDeposits
    .filter(d => d.status === 'Paid')
    .reduce((sum, d) => sum + d.amount, 0);

  const memberLoans = selectedMember 
    ? loans.filter(l => l.memberId === selectedMember.id) 
    : [];

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* ----------------- MEMBER PROFILE VIEW ----------------- */}
      {selectedMember && (
        <div className="space-y-6">
          {/* Back Button & Title banner */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedMemberId(null);
                setIsEditing(false);
              }}
              className="p-2 bg-white rounded-full hover:bg-[#faf5eb] border border-gray-200 shadow-sm transition-colors text-[#4a0404]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#4a0404] uppercase tracking-wide">{selectedMember.name}</h2>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase font-sans">{t.memberProfile}</p>
            </div>
          </div>

          {/* Profile Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: General Card / Edit Form */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{language === 'hi' ? 'बुनियादी जानकारी' : 'Basic Info'}</h3>
                {!isEditing && (
                  <button
                    onClick={() => handleOpenEdit(selectedMember)}
                    className="p-1.5 text-gray-500 hover:text-[#4a0404] hover:bg-gray-50 rounded transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#c5a059]" />
                    {language === 'hi' ? 'संपादित करें' : 'Edit'}
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.memberName}</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5E121E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.phone}</label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5E121E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.monthlyDepositAmount} (₹)</label>
                    <input
                      type="number"
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(Number(e.target.value))}
                      className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5E121E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">{t.joiningDate}</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full text-sm px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5E121E]"
                      required
                    />
                  </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white py-2 rounded transition-colors"
                      >
                        {t.save}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 text-[10px] uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition-colors"
                      >
                        {t.cancel}
                      </button>
                    </div>
                </form>
              ) : (
                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-gray-400 leading-none">{t.phone}</p>
                      <p className="font-bold mt-0.5">{selectedMember.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <PiggyBank className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-gray-400 leading-none">{t.monthlyDepositAmount}</p>
                      <p className="font-bold mt-0.5">₹{selectedMember.monthlyDeposit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-700">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <p className="text-xs text-gray-400 leading-none">{t.joiningDate}</p>
                      <p className="font-bold mt-0.5">{selectedMember.joiningDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Savings overview */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{t.totalSavingsReceived}</h3>
              </div>
              <div className="py-4">
                <h2 className="text-4xl font-black text-emerald-700">₹{memberTotalSavings.toLocaleString('en-IN')}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {memberDeposits.filter(d => d.status === 'Paid').length} {language === 'hi' ? 'महीनों की किस्त जमा' : 'months deposits collected'}
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded-lg font-medium">
                {language === 'hi' ? 'सभी जमा बचत पर 0% ब्याज देय है।' : 'All savings deposits carry 0% raw cost.'}
              </div>
            </div>

            {/* Right: Loan summary */}
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{t.loanHistory}</h3>
              </div>
              <div className="py-4">
                <h2 className="text-4xl font-black text-amber-700">{memberLoans.length}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {memberLoans.filter(l => l.status === 'Active').length} {t.active} • {memberLoans.filter(l => l.status === 'Closed').length} {t.closed}
                </p>
              </div>
              <div className="bg-amber-50 text-amber-800 text-xs p-2.5 rounded-lg font-medium">
                {language === 'hi' ? 'ऋण पर देय ब्याज राशि उपलब्ध कोष में जुड़ती है।' : 'Loan interest earned goes back into the common fund.'}
              </div>
            </div>
          </div>

          {/* Profile Tabs: Savings History OR Loans Detail */}
          <div className="bg-white rounded border border-[#c5a059]/20 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setProfileTab('savings')}
                className={`flex-1 py-3.5 text-center font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                  profileTab === 'savings'
                    ? 'border-[#4a0404] text-[#4a0404] bg-[#faf5eb]/60'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.depositHistory}
              </button>
              <button
                onClick={() => setProfileTab('loans')}
                className={`flex-1 py-3.5 text-center font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${
                  profileTab === 'loans'
                    ? 'border-[#4a0404] text-[#4a0404] bg-[#faf5eb]/60'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.loans}
              </button>
            </div>

            <div className="p-5">
              {/* SAVINGS SUBTAB */}
              {profileTab === 'savings' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                        <th className="p-3">{t.month}</th>
                        <th className="p-3">{language === 'hi' ? 'जमा राशि' : 'Deposit Amount'}</th>
                        <th className="p-3">{t.status}</th>
                        <th className="p-3">{t.action}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* We will generate previous 12 months for visual check */}
                      {['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'].map(monthKey => {
                        const deposit = memberDeposits.find(d => d.monthKey === monthKey);
                        const isPaid = deposit && deposit.status === 'Paid';

                        return (
                          <tr key={monthKey} className="hover:bg-gray-50/40">
                            <td className="p-3 font-bold text-gray-700">
                              {formatMonthLabel(monthKey, language)}
                            </td>
                            <td className="p-3 font-mono">
                              ₹{selectedMember.monthlyDeposit.toLocaleString('en-IN')}
                            </td>
                            <td className="p-3">
                              {isPaid ? (
                                <div className="flex flex-col">
                                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 w-fit">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    {t.paid}
                                  </span>
                                  <span className="text-[10px] text-gray-400 mt-0.5 font-mono">
                                    {deposit.date}
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 w-fit">
                                  {t.pending}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {isPaid ? (
                                <button
                                  onClick={() => onUndoDepositSpecific(deposit.id)}
                                  className="text-[10px] uppercase tracking-wider font-bold text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 transition-colors"
                                >
                                  {t.undo}
                                </button>
                              ) : (
                                <button
                                  onClick={() => onRecordDeposit(selectedMember.id, selectedMember.monthlyDeposit, todayStr, monthKey)}
                                  className="text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white px-2.5 py-1 rounded transition-all shadow-sm"
                                >
                                  {t.recordPayment}
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

              {/* LOANS SUBTAB */}
              {profileTab === 'loans' && (
                <div className="space-y-6">
                  {memberLoans.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <HandCoins className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p className="font-bold text-sm">{t.noLoans}</p>
                    </div>
                  ) : (
                    memberLoans.map(loan => {
                      // Loan Progress
                      const totalEmis = loan.durationMonths;
                      const paidEmis = loan.emis.filter(e => e.status === 'Paid').length;
                      const pctCompleted = Math.round((paidEmis / totalEmis) * 100);

                      // Summary math
                      const principalPaid = loan.emis.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.principalComponent, 0);
                      const interestPaid = loan.emis.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.interestComponent, 0);
                      const outstanding = Math.max(0, loan.principal - principalPaid);

                      return (
                        <div key={loan.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 space-y-4">
                          {/* Loan header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-base text-gray-800">
                                  ₹{loan.principal.toLocaleString('en-IN')} @ {loan.interestRate}% {language === 'hi' ? 'ब्याज' : 'int.'}
                                </h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                  loan.status === 'Active' 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {loan.status === 'Active' ? t.active : t.closed}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 font-mono">
                                {language === 'hi' ? 'ऋण स्वीकृत तिथि' : 'Sanctioned Date'}: {loan.dateIssued} • {loan.durationMonths} {language === 'hi' ? 'महीने' : 'Months'}
                              </p>
                            </div>

                            {/* Progress bar info */}
                            <div className="w-full sm:w-48 text-right space-y-1">
                              <div className="flex justify-between text-xs font-bold text-gray-600">
                                <span>{language === 'hi' ? 'किश्त प्रगति' : 'EMI Progress'}</span>
                                <span className="font-mono">{paidEmis} / {totalEmis} ({pctCompleted}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className="bg-emerald-600 h-full rounded-full" 
                                  style={{ width: `${pctCompleted}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Loan micro grid metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div className="bg-white p-2.5 rounded border border-gray-100">
                              <p className="text-[10px] uppercase text-gray-400 font-bold leading-none">{language === 'hi' ? 'भुगतान मूलधन' : 'Paid Principal'}</p>
                              <p className="font-black mt-1 text-emerald-700 font-mono">₹{principalPaid.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded border border-gray-100">
                              <p className="text-[10px] uppercase text-gray-400 font-bold leading-none">{language === 'hi' ? 'भुगतान ब्याज' : 'Paid Interest'}</p>
                              <p className="font-black mt-1 text-emerald-700 font-mono">₹{interestPaid.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded border border-gray-100">
                              <p className="text-[10px] uppercase text-gray-400 font-bold leading-none">{t.outstandingPrincipal}</p>
                              <p className="font-black mt-1 text-rose-700 font-mono">₹{outstanding.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white p-2.5 rounded border border-gray-100">
                              <p className="text-[10px] uppercase text-gray-400 font-bold leading-none">{language === 'hi' ? 'बचे हुए महीने' : 'Remaining Months'}</p>
                              <p className="font-black mt-1 text-gray-700 font-mono">{totalEmis - paidEmis}</p>
                            </div>
                          </div>

                          {/* EMI Detailed table nested inside loan info */}
                          <div className="space-y-2">
                            <h5 className="font-bold text-xs text-gray-600 uppercase tracking-wider">{t.emiSchedule}</h5>
                            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                  <tr>
                                    <th className="p-2 font-bold text-gray-600">{language === 'hi' ? 'किस्त' : 'EMI'}</th>
                                    <th className="p-2 font-bold text-gray-600">{t.month}</th>
                                    <th className="p-2 font-bold text-gray-600 font-mono">{t.principal}</th>
                                    <th className="p-2 font-bold text-gray-600 font-mono">{t.interest}</th>
                                    <th className="p-2 font-bold text-gray-600 font-mono">{t.total}</th>
                                    <th className="p-2 font-bold text-gray-600">{t.status}</th>
                                    <th className="p-2 font-bold text-gray-600">{t.action}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-mono">
                                  {loan.emis.map(emi => {
                                    const isPaid = emi.status === 'Paid';
                                    return (
                                      <tr key={emi.id} className="hover:bg-gray-50/40">
                                        <td className="p-2 font-bold text-gray-700">#{emi.emiNumber}</td>
                                        <td className="p-2 font-bold text-gray-700 font-sans">{formatMonthLabel(emi.monthKey, language)}</td>
                                        <td className="p-2">₹{emi.principalComponent.toLocaleString('en-IN')}</td>
                                        <td className="p-2">₹{emi.interestComponent.toLocaleString('en-IN')}</td>
                                    <td className="p-2 font-black text-[#4a0404]">₹{emi.totalAmount.toLocaleString('en-IN')}</td>
                                        <td className="p-2">
                                          {isPaid ? (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-sans">
                                              {t.paid}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 font-sans">
                                              {t.pending}
                                            </span>
                                          )}
                                        </td>
                                        <td className="p-2">
                                          {isPaid ? (
                                            <button
                                              onClick={() => onUndoEmiPayment(loan.id, emi.emiNumber)}
                                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                              title={t.undo}
                                            >
                                              <Undo2 className="w-3.5 h-3.5" />
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => onRecordEmiPayment(loan.id, emi.emiNumber, todayStr)}
                                              className="bg-[#4a0404] hover:bg-[#2d0202] text-white text-[9px] uppercase tracking-wider font-bold py-1 px-2 rounded shadow-sm hover:shadow transition-all"
                                            >
                                              {t.recordPayment}
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
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MEMBERS LIST VIEW ----------------- */}
      {!selectedMemberId && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-[#4a0404] text-[#fdfbf7] p-6 rounded border-b-2 border-[#c5a059] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl tracking-[0.1em] font-black uppercase font-display text-[#c5a059]">{t.memberList}</h1>
              <p className="text-[10px] uppercase tracking-wider text-[#fdfbf7]/80 mt-1 font-sans">{t.membersSubtitle}</p>
            </div>
            
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-[#c5a059] hover:bg-[#d4af37] text-[#4a0404] px-4 py-2.5 rounded shadow transition-all self-start sm:self-auto hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              {t.addMember}
            </button>
          </div>

          {/* Add Member form overlay block */}
          {isAdding && (
            <div className="bg-white p-5 rounded border border-[#c5a059]/40 shadow-md">
              <div className="border-b border-gray-100 pb-2 mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[#4a0404] font-display">{t.addMember}</h3>
              </div>
              <form onSubmit={handleSaveAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.memberName}</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. राम प्रसाद (Ram Prasad)"
                    className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.phone}</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.monthlyDepositAmount} (₹)</label>
                  <input
                    type="number"
                    value={formDeposit}
                    onChange={(e) => setFormDeposit(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">{t.joiningDate}</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4a0404]"
                    required
                  />
                </div>
                <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="text-[10px] uppercase tracking-wider font-bold bg-[#4a0404] hover:bg-[#2d0202] text-white px-5 py-2.5 rounded transition-all"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-[10px] uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded transition-all"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#c5a059] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchMember}
              className="w-full pl-11 pr-4 py-3 rounded border border-[#c5a059]/20 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[#4a0404] text-sm"
            />
          </div>

          {/* Members list Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              // Stats
              const specificDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
              const totalSavings = specificDeposits.reduce((sum, d) => sum + d.amount, 0);
              const totalActiveLoans = loans.filter(l => l.memberId === member.id && l.status === 'Active').length;

              return (
                <div 
                  key={member.id} 
                  id={`member-card-${member.id}`}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">{member.name}</h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D4AF37]" /> {member.phone}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {language === 'hi' ? 'किस्त:' : 'Due:'} ₹{member.monthlyDeposit.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-b border-gray-50 py-3 text-xs">
                      <div>
                        <p className="text-gray-400 leading-none">{language === 'hi' ? 'कुल बचत' : 'Total Savings'}</p>
                        <p className="font-black text-emerald-700 mt-1 font-mono">₹{totalSavings.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 leading-none">{t.activeLoans}</p>
                        <p className="font-black text-amber-700 mt-1">{totalActiveLoans}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      id={`view-profile-btn-${member.id}`}
                      onClick={() => {
                        setSelectedMemberId(member.id);
                        setProfileTab('savings');
                      }}
                      className="flex-1 text-center py-2 text-[10px] uppercase tracking-wider font-bold bg-[#4a0404]/5 hover:bg-[#4a0404]/10 text-[#4a0404] rounded transition-all flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {t.viewProfile}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-2 bg-gray-50 hover:bg-[#faf5eb] text-[#c5a059] rounded border border-gray-100 transition-colors"
                      title={t.editMember}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
