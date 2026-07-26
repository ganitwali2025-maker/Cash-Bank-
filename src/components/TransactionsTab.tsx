import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Filter
} from 'lucide-react';

export default function TransactionsTab() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Deposit', 'Withdraw', 'Loan', 'Interest'];

  const transactions = [
    {
      id: 1,
      type: 'Deposit',
      title: 'Deposit from Ramesh Kumar',
      date: '24 May 2025, 10:30 AM',
      amount: '+₹2,000',
      status: 'Success',
      isPositive: true
    },
    {
      id: 2,
      type: 'Loan EMI',
      title: 'Loan EMI from Suresh Patel',
      date: '23 May 2025, 04:45 PM',
      amount: '+₹2,000',
      status: 'Success',
      isPositive: true
    },
    {
      id: 3,
      type: 'Interest',
      title: 'Interest Credited',
      date: '22 May 2025, 11:15 AM',
      amount: '+₹150',
      status: 'Success',
      isPositive: true
    },
    {
      id: 4,
      type: 'Withdraw',
      title: 'Withdraw by Mohit Verma',
      date: '21 May 2025, 03:30 PM',
      amount: '-₹1,000',
      status: 'Success',
      isPositive: false
    },
    {
      id: 5,
      type: 'Deposit',
      title: 'Deposit from Anjali Singh',
      date: '20 May 2025, 09:20 AM',
      amount: '+₹1,500',
      status: 'Success',
      isPositive: true
    }
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold tracking-wider uppercase font-display pl-2">Transactions</h1>
        <button className="p-1 rounded-full hover:bg-white/10 transition">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Filter Pills */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-2 px-2">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-[#5A0000] text-white' 
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3 pt-2">
          {transactions.map(txn => (
            <div key={txn.id} className="bg-white rounded-[20px] p-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  txn.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {txn.isPositive ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{txn.title}</h4>
                  <p className="text-[9px] text-gray-500 font-medium mt-0.5">{txn.date}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold font-serif ${txn.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {txn.amount}
                </p>
                <p className="text-[9px] text-green-600 font-bold uppercase tracking-wider mt-0.5">{txn.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
