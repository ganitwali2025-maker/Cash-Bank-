import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      onStart();
    }, 1500); // 1.5 seconds loading delay
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#080E26] via-[#0E1B4A] to-[#0A1236] flex flex-col items-center justify-between min-h-[100svh] overflow-hidden">
      
      {/* Top Graphic Elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[150px] -right-[100px] w-[300px] h-[300px] bg-[#FCD34D] rounded-full mix-blend-overlay opacity-20 blur-3xl animate-scale-in"></div>
        <div className="absolute top-[50px] -left-[100px] w-[200px] h-[200px] bg-[#F59E0B] rounded-full mix-blend-overlay opacity-20 blur-2xl animate-scale-in delay-300"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10 mt-12">
        
        {/* Logo Container */}
        <div className="relative mb-8 animate-scale-in delay-100">
          <div className="absolute inset-0 bg-[#FCD34D] blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="w-32 h-32 bg-[#0E1B4A] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(252,211,77,0.4)] border-4 border-[#FCD34D] relative z-10 overflow-hidden p-3">
            <img src="/icons/icon-512x512.png" alt="App Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-lg animate-fade-in-up delay-300">
            CASH<br />BANK
          </h1>
          
          <div className="w-16 h-1 bg-[#FCD34D] mx-auto rounded-full animate-fade-in-up delay-500"></div>
          
          <p className="font-sans text-[#FCD34D] font-bold text-sm sm:text-base tracking-[0.2em] uppercase animate-fade-in-up delay-700">
            Ujjwal Bhavishya Samiti
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full px-6 pb-12 pt-8 relative z-10 animate-fade-in-up delay-700">
        <div className="max-w-sm mx-auto w-full space-y-6">
          <button 
            onClick={handleStart}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#FCD34D] via-[#F59E0B] to-[#FCD34D] text-[#0E1B4A] py-4 px-8 rounded-2xl font-black text-lg uppercase tracking-wider overflow-hidden shadow-[0_8px_30px_rgba(245,158,11,0.4)] transition-transform active:scale-95 disabled:opacity-90 disabled:scale-100 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10">{isLoading ? 'Loading...' : 'Get Started'}</span>
            {isLoading ? (
              <div className="w-5 h-5 border-[3px] border-[#0E1B4A]/20 border-t-[#0E1B4A] rounded-full animate-spin relative z-10"></div>
            ) : (
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-2 text-white/50">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Secure & Private</span>
            </div>
            <p className="text-[9px] text-[#FCD34D]/80 uppercase tracking-[0.2em] font-sans font-bold flex items-center justify-center">
              Developer: Lokesh Rajak
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
