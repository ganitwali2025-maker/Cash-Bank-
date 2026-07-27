import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  ChevronRight,
  Filter,
  PiggyBank,
  Landmark,
  Calendar,
  Hourglass,
  ShieldCheck,
  BarChart2
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
          const isActive = savingsBalance > 0 || loanBalance > 0;
          const joinDate = new Date(member.joiningDate);
          const now = new Date();
          const monthsDiff = (now.getFullYear() - joinDate.getFullYear()) * 12 + now.getMonth() - joinDate.getMonth();
          const years = Math.floor(monthsDiff / 12);
          const months = monthsDiff % 12;
          const memberSinceStr = years > 0 ? `${years} Yr ${months} Mo` : `${months} Mo`;

          return (
            <div 
              key={member.id} 
              onClick={() => navigate(`/savings/${member.id}`)}
              className="bg-[#FFFDF8] rounded-[24px] shadow-[0_10px_30px_rgba(90,0,0,0.2)] flex flex-col relative overflow-hidden mb-6 border-[3px] border-[#D4AF37] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Maroon Header with Wavy Bottom */}
              <div className="absolute top-0 left-0 w-full h-[140px] bg-[linear-gradient(110deg,#5A0000_30%,#8A0000_50%,#5A0000_70%)] overflow-hidden">
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                {/* Wavy SVG Divider at the bottom of the maroon box */}
                <svg className="absolute bottom-[-1px] w-full h-[40px] text-[#FFFDF8]" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,128C672,128,768,160,864,170.7C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>

              {/* Header Content */}
              <div className="pt-5 px-5 relative z-10 flex justify-between items-start">
                <div className="absolute left-4 top-4">
                  <span className="px-3 py-1.5 bg-white/10 text-white/90 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center gap-2 border border-white/20 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"></span> ID: {member.id.replace('member-', 'MB-')}
                  </span>
                </div>
                
                <div className="flex-1 flex justify-center items-center gap-2 mt-1">
                  <span className="text-[#D4AF37] opacity-80 text-[10px]">🌿</span>
                  <p className="text-[#D4AF37] text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-bold drop-shadow-md">
                    UJJWAL BHAVISYA
                  </p>
                  <span className="text-[#D4AF37] opacity-80 text-[10px]">🌿</span>
                </div>
                
                <div className="absolute right-4 top-4">
                  {isActive ? (
                    <span className="px-3 py-1.5 bg-[#1A3B22] text-[#4ADE80] text-[9px] font-bold uppercase tracking-wider rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]"></span> ACTIVE
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center gap-2 border border-white/10 backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-white/50"></span> INACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Section */}
              <div className="flex flex-col items-center mt-6 relative z-10">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  <div className="w-[90px] h-[90px] rounded-full bg-[#D4AF37] border-4 border-white flex items-center justify-center text-[#5A0000] text-3xl font-black shadow-inner">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <h3 className="font-black text-[#3e0303] text-2xl mt-4 tracking-wide uppercase mb-3">{member.name}</h3>

              </div>



              {/* Bottom Info & Button */}
              <div className="bg-[linear-gradient(110deg,#5A0000_30%,#8A0000_50%,#5A0000_70%)] relative overflow-hidden text-white pt-5 px-4 pb-5">
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                <div className="grid grid-cols-4 divide-x divide-white/10 mb-6">
                  <div className="px-2 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <p className="text-[9px] uppercase tracking-wider font-bold">Joined On</p>
                    </div>
                    <p className="text-[12px] font-bold text-white">{new Date(member.joiningDate).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                  </div>
                  
                  <div className="px-2 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                      <Hourglass className="w-3.5 h-3.5" />
                      <p className="text-[9px] uppercase tracking-wider font-bold">Member Since</p>
                    </div>
                    <p className="text-[12px] font-bold text-white">{memberSinceStr || 'New'}</p>
                  </div>
                  
                  <div className="px-2 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <p className="text-[9px] uppercase tracking-wider font-bold">KYC Status</p>
                    </div>
                    <p className="text-[12px] font-bold text-[#4ADE80]">Verified</p>
                  </div>
                  
                  <div className="px-2 flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-[#D4AF37] mb-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                      <p className="text-[9px] uppercase tracking-wider font-bold">Member Type</p>
                    </div>
                    <p className="text-[12px] font-bold text-white">Regular</p>
                  </div>
                </div>
              </div>
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
