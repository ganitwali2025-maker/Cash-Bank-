import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PiggyBank, 
  HandCoins, 
  ReceiptIndianRupee, 
  FileSpreadsheet, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Settings,
  LogOut,
  Calendar
} from 'lucide-react';
import { TabType, LanguageType } from '../types';
import { translations } from '../translations';
import { formatMonthLabel } from './Header';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  memberCount: number;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  isOpen,
  setIsOpen,
  memberCount,
  selectedMonth,
  setSelectedMonth
}: SidebarProps) {
  const t = translations[language];

  const handlePrevMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    month--;
    if (month < 1) { month = 12; year--; }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    month++;
    if (month > 12) { month = 1; year++; }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const menuItems = [
    { id: 'dashboard' as TabType, menuText: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: LayoutDashboard },
    { id: 'members' as TabType, menuText: language === 'hi' ? 'सदस्य' : 'Members', icon: Users },
    { id: 'deposits' as TabType, menuText: language === 'hi' ? 'मासिक जमा' : 'Savings', icon: PiggyBank },
    { id: 'loans' as TabType, menuText: language === 'hi' ? 'लोन' : 'Loans', icon: HandCoins },
    { id: 'emis' as TabType, menuText: language === 'hi' ? 'EMI भुगतान' : 'Payments', icon: ReceiptIndianRupee },
    { id: 'reports' as TabType, menuText: language === 'hi' ? 'रिपोर्ट व सारांश' : 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Dark Semi-Transparent Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sliding Sidebar */}
      <aside 
        id="sidebar-container"
        className={`fixed top-0 left-0 z-40 h-screen w-[280px] pt-24 md:pt-16 pb-20 md:pb-0 transition-transform duration-300 ease-in-out bg-[#5A0000] text-white flex flex-col justify-between border-r border-[#D4AF37]/30 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Month Selector in Sidebar */}
          <div className="mx-4 mt-2 mb-4 md:hidden">
            <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 border border-[#D4AF37]/20">
              <div className="p-1.5 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className="p-1 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-bold font-sans text-xs uppercase tracking-wider text-white w-24 text-center">
                  {formatMonthLabel(selectedMonth, 'en')}
                </span>
                <button onClick={handleNextMonth} className="p-1 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-full transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Member Counter Summary Block */}
          <div className="mx-4 my-4 p-3 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-sans">{t.totalMembers}</p>
              <h4 className="text-xl font-bold font-serif text-[#D4AF37] mt-0.5">{memberCount}</h4>
            </div>
            <div className="text-right">
              <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-sans uppercase font-bold tracking-wider">
                {language === 'hi' ? 'सक्रिय' : 'Active'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-tab-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group relative ${
                    isSelected 
                      ? 'bg-[#D4AF37]/10 text-white font-bold' 
                      : 'text-white/80 hover:bg-[#D4AF37]/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-[#D4AF37]' : 'text-white/60 group-hover:text-[#D4AF37] transition-colors'}`} />
                  <span className={`text-[13px] tracking-wide font-sans ${isSelected ? 'text-white' : 'text-white/90'}`}>
                    {item.menuText}
                  </span>
                </button>
              );
            })}
            
            <div className="my-2 border-t border-[#D4AF37]/10 mx-2"></div>
            
            <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 text-white/80 hover:bg-[#D4AF37]/5 hover:text-white group">
              <Settings className="w-5 h-5 shrink-0 text-white/60 group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-[13px] tracking-wide font-sans text-white/90">Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Language & Info Section */}
        <div className="p-4 border-t border-[#D4AF37]/10 bg-black/10 shrink-0">
          {/* Language Switcher */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.15em] text-white/50 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" /> Language
            </label>
            <div className="flex items-center bg-black/20 p-1 rounded-lg border border-[#D4AF37]/10">
              <button
                id="lang-toggle-hi"
                onClick={() => setLanguage('hi')}
                className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-sans font-bold transition-all ${
                  language === 'hi' 
                    ? 'bg-[#D4AF37] text-[#5A0000] shadow' 
                    : 'text-white/80 hover:text-[#D4AF37]'
                }`}
              >
                हिन्दी
              </button>
              <button
                id="lang-toggle-en"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-sans font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-[#D4AF37] text-[#5A0000] shadow' 
                    : 'text-white/80 hover:text-[#D4AF37]'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-red-200 transition-colors border border-red-900/30">
            <LogOut className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Logout</span>
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-[9px] text-white/40 flex items-center justify-center gap-1 uppercase tracking-widest">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" /> © 2026 Ujjwal Bhawishya
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
