import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { Member, Deposit, Loan, LanguageType } from '../types';
import { translations } from '../translations';

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
  onAddMember,
}: MembersTabProps) {
  const t = translations[language];
  const navigate = useNavigate();

  // Search & Navigation States
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit / Add Form Local States
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDeposit, setFormDeposit] = useState(1000);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  // Filters members list
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

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

  // Calculate balances
  const getSavingsBalance = (memberId: string) => {
    return deposits
      .filter(d => d.memberId === memberId && d.status === 'Paid')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getLoanBalance = (memberId: string) => {
    const memberLoans = loans.filter(l => l.memberId === memberId && l.status === 'Active');
    let totalOutstanding = 0;
    memberLoans.forEach(loan => {
      const paidPrincipal = loan.emis
        .filter(e => e.status === 'Paid')
        .reduce((sum, e) => sum + e.principalComponent, 0);
      totalOutstanding += (loan.principal - paidPrincipal);
    });
    return totalOutstanding;
  };

  return (
    <div className="space-y-4 px-4 pt-4 pb-24">
      {/* Search and Filter Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:outline-none focus:ring-1 focus:ring-[#5A0000] text-sm"
          />
        </div>
        <button 
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 text-gray-500 hover:text-[#5A0000] transition-colors"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Add Member form overlay block */}
      {isAdding && (
        <div className="bg-white p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#5A0000]/10 mb-6">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#5A0000]">{t.addMember}</h3>
          </div>
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.memberName}</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5A0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.phone}</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5A0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.monthlyDepositAmount} (₹)</label>
              <input
                type="number"
                value={formDeposit}
                onChange={(e) => setFormDeposit(Number(e.target.value))}
                className="w-full text-sm px-4 py-3 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5A0000]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.joiningDate}</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full text-sm px-4 py-3 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#5A0000]"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 text-[11px] uppercase tracking-wider font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-[12px] transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 text-[11px] uppercase tracking-wider font-bold bg-[#5A0000] hover:bg-[#4a0404] text-white py-3.5 rounded-[12px] transition-colors shadow-md"
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Member Cards List */}
      <div className="space-y-4">
        {filteredMembers.map((member) => {
          const savingsBalance = getSavingsBalance(member.id);
          const loanBalance = getLoanBalance(member.id);
          const isActive = savingsBalance > 0 || loanBalance > 0; // Simple logic for active badge

          return (
            <div 
              key={member.id} 
              className="bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Photo Avatar */}
                  <img 
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}&backgroundColor=5A0000`} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{member.name}</h3>
                    <p className="text-[10px] text-gray-500 font-medium">ID: {member.id.replace('member-', 'MB')}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{member.phone}</p>
                  </div>
                </div>
                
                {/* Active Badge */}
                {isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded-full self-start">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-wider rounded-full self-start">
                    Inactive
                  </span>
                )}
              </div>

              {/* Balances row */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Savings</p>
                  <p className="text-sm font-bold text-green-600 font-serif">₹{savingsBalance.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-medium">Loan</p>
                  <p className="text-sm font-bold text-red-600 font-serif">₹{loanBalance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* View Button */}
              <button 
                onClick={() => navigate(`/savings/${member.id}`)}
                className="w-full flex items-center justify-end gap-1 text-[#5A0000] text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity"
              >
                View <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {filteredMembers.length === 0 && (
          <div className="text-center py-10 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-500 font-medium mb-4">No members found</h3>
            <button 
              onClick={handleOpenAdd}
              className="px-6 py-2 bg-[#5A0000] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Add New Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
