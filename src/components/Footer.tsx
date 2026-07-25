import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#4a0404] text-white py-8 mt-12 w-full print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-xl font-bold font-display uppercase tracking-widest text-[#D4AF37]">
            CASH BANK
          </h2>
          <p className="text-sm font-sans text-gray-300 mt-1">
            उज्जवल भविष्य समिति — Ujjwal Bhavisya Samiti
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end text-sm font-sans text-gray-400 gap-2">
          <p>&copy; {new Date().getFullYear()} Cash Bank. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
