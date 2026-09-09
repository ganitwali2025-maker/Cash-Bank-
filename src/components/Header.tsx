import React from 'react';
import { Menu, Calendar, User, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { LanguageType } from '../types';
import { translations } from '../translations';
import InstallPWA from './InstallPWA';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: LanguageType;
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (month: string) => void;
}

export function formatMonthLabel(monthKey: string, language: LanguageType): string {
  const [year, month] = monthKey.split('-');
  const monthNum = parseInt(month);
  
  const monthsHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 
    'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
  ];
  
  const monthsEn = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthName = language === 'hi' ? monthsHi[monthNum - 1] : monthsEn[monthNum - 1];
  return `${monthName} ${year}`;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  language,
  selectedMonth,
  setSelectedMonth
}: HeaderProps) {
  const t = translations[language];

  // Shorter display for helper
  const handlePrevMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    
    month--;
    if (month < 1) {
      month = 12;
      year--;
    }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let year = parseInt(yearStr);
    let month = parseInt(monthStr);
    
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
    setSelectedMonth(`${year}-${String(month).padStart(2, '0')}`);
  };

  return (
    <header 
      id="app-header"
      className="relative overflow-hidden bg-gradient-to-r from-[#080E26] via-[#0E1B4A] to-[#0A1236] text-white shadow-[0_10px_30px_rgba(8,14,38,0.5)] h-[84px] sm:h-[90px] px-4 sm:px-6 flex items-center justify-between z-50 sticky top-0 w-full print:hidden rounded-b-[28px] md:rounded-none border-b border-[#F59E0B]/20"
    >
      {/* Light sheen ambient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Left section: Hamburger & App title */}
      <div className="flex items-center gap-3 sm:gap-4 relative z-10">
        {!sidebarOpen && (
          <button
            id="header-sidebar-open-btn"
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none shadow-md backdrop-blur-md"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
          </button>
        )}
        
        {/* Title & Lotus Emblem Area */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FCD34D] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <div className="w-full h-full bg-[#0E1B4A] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#FCD34D]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 4.5 9 8 9 11.5C9 14.5 10.3 16.8 12 17.5C13.7 16.8 15 14.5 15 11.5C15 8 13.5 4.5 12 2ZM12 19.5C8.5 19.5 5 17.5 3 15C5.5 15 8.5 14 10.5 12C9 14 8 16.5 8 18.5C9.2 19.1 10.6 19.5 12 19.5ZM12 19.5C13.4 19.5 14.8 19.1 16 18.5C16 16.5 15 14 13.5 12C15.5 14 18.5 15 21 15C19 17.5 15.5 19.5 12 19.5Z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-black text-white text-[20px] sm:text-[24px] leading-tight tracking-wider uppercase font-display drop-shadow-md">
              CASH BANK
            </h1>
            <p className="text-[#FCD34D] text-[10px] sm:text-[11px] font-medium tracking-wide whitespace-nowrap opacity-90 leading-none">
              — {language === 'hi' ? 'उज्जवल भविष्य समिति' : 'Ujjwal Bhavishya Samiti'} —
            </p>
          </div>
        </div>
      </div>

      {/* Right section: Icons */}
      <div className="flex items-center gap-2.5 sm:gap-4 relative z-10">
        {/* Month Selector Component (Desktop Only) */}
        <div className="hidden md:flex items-center bg-white/10 rounded-full px-1.5 py-1 border border-white/15 shrink-0 backdrop-blur-md mr-2">
          <button
            id="header-prev-month"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 px-3 font-sans font-bold text-xs text-[#FCD34D] uppercase tracking-wider">
            <span id="current-month-display" className="whitespace-nowrap text-center drop-shadow-sm">
              {formatMonthLabel(selectedMonth, language)}
            </span>
          </div>

          <button
            id="header-next-month"
            onClick={handleNextMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <InstallPWA />
        
        <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors group">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform text-white" strokeWidth={2} />
          <span className="absolute top-1 right-1 w-[16px] h-[16px] bg-[#EF4444] border border-[#0E1B4A] rounded-full text-[9px] text-white flex items-center justify-center font-black shadow-md">3</span>
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#FCD34D] text-[#FCD34D] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(252,211,77,0.3)] hover:bg-[#FCD34D]/10 transition-colors cursor-pointer">
          <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}
