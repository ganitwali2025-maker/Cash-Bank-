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
    <div className="fixed inset-0 z-[100] bg-[#5A0000] flex flex-col items-center justify-between min-h-[100svh] overflow-hidden">
      
      {/* Top Graphic Elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[150px] -right-[100px] w-[300px] h-[300px] bg-[#D4AF37] rounded-full mix-blend-overlay opacity-20 blur-3xl animate-scale-in"></div>
        <div className="absolute top-[50px] -left-[100px] w-[200px] h-[200px] bg-[#E8C34D] rounded-full mix-blend-overlay opacity-20 blur-2xl animate-scale-in delay-300"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 relative z-10 mt-12">
        
        {/* Logo Container */}
        <div className="relative mb-8 animate-scale-in delay-100">
          <div className="absolute inset-0 bg-[#D4AF37] blur-xl opacity-30 rounded-full animate-pulse"></div>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] border-4 border-[#D4AF37] relative z-10 overflow-hidden p-3">
            <img src="/icons/icon-512x512.png" alt="App Logo" className="w-full h-full object-contain drop-shadow-sm" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl sm:text-6xl font-black text-white tracking-widest drop-shadow-lg animate-fade-in-up delay-300">
            CASH<br />BANK
          </h1>
          
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full animate-fade-in-up delay-500"></div>
          
          <p className="font-sans text-[#E8C34D] font-bold text-sm sm:text-base tracking-[0.2em] uppercase animate-fade-in-up delay-700">
            Ujjwal Bhavisya Samiti
          </p>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full px-6 pb-12 pt-8 relative z-10 animate-fade-in-up delay-700">
        <div className="max-w-sm mx-auto w-full space-y-6">
          <button 
            onClick={handleStart}
            disabled={isLoading}
            className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4AF37] to-[#B38D1E] text-[#5A0000] py-4 px-8 rounded-2xl font-black text-lg uppercase tracking-wider overflow-hidden shadow-[0_8px_30px_rgba(212,175,55,0.3)] transition-transform active:scale-95 disabled:opacity-90 disabled:scale-100"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="relative z-10">{isLoading ? 'Loading...' : 'Get Started'}</span>
            {isLoading ? (
              <div className="w-5 h-5 border-[3px] border-[#5A0000]/20 border-t-[#5A0000] rounded-full animate-spin relative z-10"></div>
            ) : (
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-white/50">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Secure & Private</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
