import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Member, 
  Deposit, 
  Loan, 
  Emi, 
  TabType, 
  LanguageType 
} from './types';
import { 
  initialMembers, 
  getInitialDeposits, 
  getInitialLoans 
} from './initialData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MembersTab from './components/MembersTab';
import MonthlyDepositsTab from './components/MonthlyDepositsTab';
import LoansTab from './components/LoansTab';
import EmiPaymentsTab from './components/EmiPaymentsTab';
import ReportsTab from './components/ReportsTab';
import { translations } from './translations';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X,
  Home,
  Users,
  Plus,
  PieChart,
  LayoutGrid
} from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Core States
  const [language, setLanguage] = useState<LanguageType>(() => {
    const saved = localStorage.getItem('ub_lang');
    return (saved === 'en' || saved === 'hi') ? saved : 'hi';
  });

  // Derived current tab for UI highlighting
  let currentTabRaw = location.pathname.substring(1) || 'dashboard';
  // Check if it's a valid TabType, otherwise fallback to dashboard for UI highlights
  const validTabs = ['dashboard', 'members', 'deposits', 'loans', 'emis', 'reports'];
  const currentTab = validTabs.includes(currentTabRaw) ? currentTabRaw as TabType : 'dashboard';
  
  const setCurrentTab = (tab: TabType) => {
    if (tab === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };
  
  // Set default selected month to July 2026 based on the local time (2026-07)
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-07');
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // 2. Data Persistence States (from localStorage or seed)
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ub_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
    const saved = localStorage.getItem('ub_deposits');
    return saved ? JSON.parse(saved) : getInitialDeposits();
  });

  const [loans, setLoans] = useState<Loan[]>(() => {
    const saved = localStorage.getItem('ub_loans');
    return saved ? JSON.parse(saved) : getInitialLoans();
  });

  // 3. Custom Toast System State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-save data changes to localStorage
  useEffect(() => {
    localStorage.setItem('ub_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ub_deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('ub_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('ub_lang', language);
  }, [language]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const t = translations[language];

  // 4. Action Handlers

  // Member Handlers
  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
    showToast(language === 'hi' ? 'नया सदस्य सफलतापूर्वक जोड़ा गया!' : 'New member added successfully!');
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    showToast(language === 'hi' ? 'सदस्य विवरण सफलतापूर्वक अपडेट किया गया!' : 'Member details updated successfully!');
  };

  // Deposit Handlers
  const handleRecordDeposit = (memberId: string, amount: number, date: string, monthKey?: string) => {
    const activeMonth = monthKey || selectedMonth;
    const depositId = `${memberId}_${activeMonth}`;
    const newDeposit: Deposit = {
      id: depositId,
      memberId,
      monthKey: activeMonth,
      amount,
      date,
      status: 'Paid'
    };

    setDeposits(prev => {
      // Remove any duplicate if exists, and insert new
      const filtered = prev.filter(d => d.id !== depositId);
      return [...filtered, newDeposit];
    });

    showToast(t.paymentRecorded, 'success');
  };

  const handleUndoDeposit = (memberId: string) => {
    const depositId = `${memberId}_${selectedMonth}`;
    handleUndoDepositSpecific(depositId);
  };

  const handleUndoDepositSpecific = (depositId: string) => {
    setDeposits(prev => prev.filter(d => d.id !== depositId));
    showToast(t.paymentUndone, 'info');
  };

  // Loan Handlers
  const handleAddLoan = (newLoan: Loan) => {
    setLoans(prev => [...prev, newLoan]);
    showToast(t.newLoanCreated, 'success');
  };

  const handleRecordEmiPayment = (loanId: string, emiNumber: number, date: string) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const updatedEmis = loan.emis.map(emi => {
          if (emi.emiNumber === emiNumber) {
            return {
              ...emi,
              status: 'Paid' as const,
              paymentDate: date
            };
          }
          return emi;
        });

        // If all EMIs are paid, mark the loan as Closed
        const allPaid = updatedEmis.every(e => e.status === 'Paid');
        const updatedStatus = allPaid ? ('Closed' as const) : ('Active' as const);

        if (allPaid) {
          showToast(t.loanClosed, 'success');
        } else {
          showToast(t.paymentRecorded, 'success');
        }

        return {
          ...loan,
          status: updatedStatus,
          emis: updatedEmis
        };
      }
      return loan;
    }));
  };

  const handleUndoEmiPayment = (loanId: string, emiNumber: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const updatedEmis = loan.emis.map(emi => {
          if (emi.emiNumber === emiNumber) {
            return {
              ...emi,
              status: 'Pending' as const,
              paymentDate: null
            };
          }
          return emi;
        });

        // Marked back to Active since a payment is undone
        return {
          ...loan,
          status: 'Active' as const,
          emis: updatedEmis
        };
      }
      return loan;
    }));

    showToast(t.paymentUndone, 'info');
  };

  // Navigates directly to a member's profile page from another tab
  const handleNavigateToMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setCurrentTab('members');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 font-sans antialiased selection:bg-[#5E121E]/10 selection:text-[#5E121E]">
      
      {/* SIDEBAR BLOCK */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // If we navigate to members tab, default to list view
          if (tab !== 'members') {
            setSelectedMemberId(null);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        memberCount={members.length}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      {/* MAIN CONTAINER LAYOUT */}
      <div className="transition-all duration-300 min-h-screen flex flex-col pb-20 md:pb-0 pl-0 w-full">
        {/* GOLD HEADER BAR */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          language={language}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

        {/* WORKSPACE AREA */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          <Routes>
            <Route path="/" element={
              <Dashboard
                members={members}
                deposits={deposits}
                loans={loans}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                language={language}
                onRecordDeposit={handleRecordDeposit}
                onUndoDeposit={handleUndoDeposit}
                onRecordEmiPayment={handleRecordEmiPayment}
                onUndoEmiPayment={handleUndoEmiPayment}
                onNavigateToMember={handleNavigateToMember}
              />
            } />
            
            <Route path="/members" element={
              <MembersTab
                members={members}
                deposits={deposits}
                loans={loans}
                language={language}
                selectedMonth={selectedMonth}
                onUpdateMember={handleUpdateMember}
                onAddMember={handleAddMember}
                onRecordDeposit={handleRecordDeposit}
                onUndoDepositSpecific={handleUndoDepositSpecific}
                onRecordEmiPayment={handleRecordEmiPayment}
                onUndoEmiPayment={handleUndoEmiPayment}
                selectedMemberId={selectedMemberId}
                setSelectedMemberId={setSelectedMemberId}
              />
            } />
            
            <Route path="/deposits" element={
              <MonthlyDepositsTab
                members={members}
                deposits={deposits}
                selectedMonth={selectedMonth}
                language={language}
                onRecordDeposit={handleRecordDeposit}
                onUndoDepositSpecific={handleUndoDepositSpecific}
              />
            } />
            
            <Route path="/loans" element={
              <LoansTab
                members={members}
                loans={loans}
                language={language}
                selectedMonth={selectedMonth}
                onAddLoan={handleAddLoan}
                onRecordEmiPayment={handleRecordEmiPayment}
                onUndoEmiPayment={handleUndoEmiPayment}
                onNavigateToMember={handleNavigateToMember}
              />
            } />
            
            <Route path="/emis" element={
              <EmiPaymentsTab
                members={members}
                loans={loans}
                selectedMonth={selectedMonth}
                language={language}
                onRecordEmiPayment={handleRecordEmiPayment}
                onUndoEmiPayment={handleUndoEmiPayment}
                onNavigateToMember={handleNavigateToMember}
              />
            } />
            
            <Route path="/reports" element={
              <ReportsTab
                members={members}
                deposits={deposits}
                loans={loans}
                language={language}
              />
            } />

            <Route path="*" element={
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-4xl font-black text-[#5A0000] mb-2 font-display">404</h2>
                <p className="text-gray-500 font-sans">Page Not Found</p>
                <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-[#5A0000] text-white font-bold rounded-lg uppercase tracking-wider text-sm shadow-md">
                  Go Home
                </button>
              </div>
            } />
          </Routes>

        </main>
      </div>

      {/* FLOATING NOTIFICATION BANNER (TOAST) */}
      {toast && (
        <div 
          id="global-toast"
          className="fixed bottom-24 md:bottom-5 right-5 z-50 bg-white border border-gray-150 rounded-lg shadow-xl p-4 flex items-center gap-3 animate-slide-in max-w-sm"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600 shrink-0" />}
          
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">{toast.message}</p>
          </div>

          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFFDF8] border-t border-gray-200 flex items-center justify-between px-6 py-2 pb-6 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'dashboard' ? 'text-[#5A0000]' : 'text-gray-400'}`}
        >
          <div className={`p-1.5 rounded-xl ${currentTab === 'dashboard' ? 'bg-[#5A0000]/10' : ''}`}>
            <Home className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button 
          onClick={() => setCurrentTab('members')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'members' ? 'text-[#5A0000]' : 'text-gray-400'}`}
        >
          <div className={`p-1.5 rounded-xl ${currentTab === 'members' ? 'bg-[#5A0000]/10' : ''}`}>
            <Users className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Members</span>
        </button>

        {/* FAB placeholder in Nav */}
        <div className="w-12"></div>

        <button 
          onClick={() => setCurrentTab('reports')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'reports' ? 'text-[#5A0000]' : 'text-gray-400'}`}
        >
          <div className={`p-1.5 rounded-xl ${currentTab === 'reports' ? 'bg-[#5A0000]/10' : ''}`}>
            <PieChart className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">Reports</span>
        </button>

        <button 
          onClick={() => setCurrentTab('deposits')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'deposits' || currentTab === 'loans' || currentTab === 'emis' ? 'text-[#5A0000]' : 'text-gray-400'}`}
        >
          <div className={`p-1.5 rounded-xl ${currentTab === 'deposits' || currentTab === 'loans' || currentTab === 'emis' ? 'bg-[#5A0000]/10' : ''}`}>
            <LayoutGrid className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold">More</span>
        </button>
      </div>

      {/* FLOATING ACTION BUTTON (Mobile) */}
      <button 
        onClick={() => setCurrentTab('members')}
        className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#5A0000] text-white rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(90,0,0,0.3)] z-50 border-4 border-[#FFFDF8]"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
