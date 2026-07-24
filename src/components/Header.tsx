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
      className="bg-[#5A0000] text-white shadow-[0_4px_20px_rgba(90,0,0,0.15)] h-24 md:h-16 px-5 sm:px-8 flex items-center justify-between transition-all z-50 print:hidden rounded-b-[28px] md:rounded-none md:bg-[#D4AF37] md:text-[#4a0404] relative"
    >
      {/* Left section: Hamburger & App title */}
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            id="header-sidebar-open-btn"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded hover:bg-white/10 md:hover:bg-[#4a0404]/10 transition-colors focus:outline-none"
            aria-label="Open Sidebar"
          >
            <Menu className="w-6 h-6 text-[#D4AF37] md:text-[#4a0404]" />
          </button>
        )}
        
        {/* Mobile Title Area */}
        <div className="md:hidden flex items-center gap-3 pl-1">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-inner">
            <span className="text-[#5A0000] font-bold font-display text-[15px] tracking-tight">UBS</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-white text-[17px] leading-tight font-display tracking-wide uppercase">
              CASH BANK
            </h1>
            <span className="text-[#D4AF37] text-[11px] font-sans font-medium tracking-wide">
              {language === 'hi' ? 'उज्जवल भविष्य समिति' : 'Ujjwal Bhavisya Samiti'}
            </span>
          </div>
        </div>

        {/* Desktop Title Area */}
        <div className="hidden md:flex items-center gap-2">
          <div>
            <h1 className="font-bold text-sm sm:text-lg tracking-[0.1em] leading-tight uppercase font-display">
              CASH BANK
            </h1>
            <span className="text-[#D4AF37] md:text-[#4a0404]/80 text-[11px] sm:text-[10px] font-sans font-bold tracking-wide block mt-0.5 uppercase tracking-[0.15em]">
              {language === 'hi' ? 'उज्जवल भविष्य समिति' : 'Ujjwal Bhavisya Samiti'}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Month Selector Component (Desktop Only) */}
        <div className="hidden md:flex items-center bg-[#fdfbf7] rounded-full px-1.5 py-0.5 shadow-sm border border-[#4a0404]/20 shrink-0">
          <button
            id="header-prev-month"
            onClick={handlePrevMonth}
            className="p-1 hover:bg-[#4a0404]/5 rounded-full transition-colors text-[#4a0404]"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 px-1 font-sans font-bold text-xs text-[#4a0404] uppercase tracking-wider">
            <span id="current-month-display" className="whitespace-nowrap min-w-[90px] text-center">
              {formatMonthLabel(selectedMonth, language)}
            </span>
          </div>

          <button
            id="header-next-month"
            onClick={handleNextMonth}
            className="p-1 hover:bg-[#4a0404]/5 rounded-full transition-colors text-[#4a0404]"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* User Badges */}
        <div className="flex items-center gap-3">
          <InstallPWA />
          <button className="relative p-1.5 text-white md:text-[#4a0404] hover:bg-white/10 rounded-full transition md:hidden">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 border-2 border-[#5A0000] rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
          </button>

          <div className="hidden md:block text-right">
            <p className="text-[9px] text-[#4a0404]/60 uppercase tracking-wider font-semibold font-sans">{t.welcome}</p>
            <p className="text-xs font-bold text-[#4a0404] font-serif uppercase tracking-tight">एडमिन: राम प्रकाश</p>
          </div>
          <div className="w-9 h-9 md:w-9 md:h-9 rounded-full border border-[#D4AF37] md:border-[#c5a059]/30 text-[#D4AF37] bg-transparent md:bg-[#4a0404] flex items-center justify-center font-bold shadow-sm">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
