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
      className="relative overflow-hidden bg-[linear-gradient(110deg,#5A0000_30%,#8A0000_50%,#5A0000_70%)] text-white shadow-[0_4px_20px_rgba(90,0,0,0.3)] h-[80px] sm:h-[86px] px-4 sm:px-6 flex items-center justify-between border-b-[3px] border-[#D4AF37] z-50 sticky top-0 w-full print:hidden rounded-b-[28px] md:rounded-none"
    >
      {/* Glossy overlay for extra shine */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

      {/* Left section: Hamburger & App title */}
      <div className="flex items-center gap-4 sm:gap-6 relative z-10">
        {!sidebarOpen && (
          <button
            id="header-sidebar-open-btn"
            onClick={() => setSidebarOpen(true)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-black/20 bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors focus:outline-none shadow-inner"
            aria-label="Open Sidebar"
          >
            <Menu className="w-6 h-6 sm:w-7 sm:h-7 text-[#D4AF37]" strokeWidth={2.5} />
          </button>
        )}
        
        {/* Title Area */}
        <div className="flex flex-col justify-center pt-1">
          <h1 className="font-black text-white text-[24px] sm:text-[30px] leading-[1] tracking-wide uppercase font-display drop-shadow-md">
            CASH BANK
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <div className="h-[1px] w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#D4AF37] relative opacity-80">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
            </div>
            <span className="text-[#D4AF37] text-[11px] sm:text-[13px] font-sans font-medium tracking-wide whitespace-nowrap drop-shadow-sm leading-none">
              {language === 'hi' ? 'उज्जवल भविष्य समिति' : 'Ujjwal Bhavisya Samiti'}
            </span>
            <div className="h-[1px] w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#D4AF37] relative opacity-80">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#D4AF37]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right section: Icons */}
      <div className="flex items-center gap-3 sm:gap-5 relative z-10">
        {/* Month Selector Component (Desktop Only) */}
        <div className="hidden md:flex items-center bg-black/20 rounded-full px-1.5 py-1 border border-white/10 shrink-0 backdrop-blur-sm mr-2">
          <button
            id="header-prev-month"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 px-3 font-sans font-bold text-xs text-[#D4AF37] uppercase tracking-wider">
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
          <Bell className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] bg-[#EF4444] border-2 border-[#6A0000] rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-md">3</span>
        </button>

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[2px] border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer mr-1">
          <User className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
        </div>
      </div>
    </header>
  );
}
