import React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  PiggyBank, 
  HandCoins, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
import { Member, Deposit, Loan, LanguageType } from '../types';
import { translations } from '../translations';

interface ReportsTabProps {
  members: Member[];
  deposits: Deposit[];
  loans: Loan[];
  language: LanguageType;
}

export default function ReportsTab({
  members,
  deposits,
  loans,
  language
}: ReportsTabProps) {
  const t = translations[language];

  // Compile individual member rows
  const memberReportRows = members.map(member => {
    // 1. Total savings paid
    const memberDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
    const totalSavingsPaid = memberDeposits.reduce((sum, d) => sum + d.amount, 0);

    // 2. Loans taken
    const memberLoans = loans.filter(l => l.memberId === member.id);
    const totalLoansTaken = memberLoans.reduce((sum, l) => sum + l.principal, 0);

    // 3. Paid EMIs principal and interest
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    memberLoans.forEach(loan => {
      loan.emis.forEach(emi => {
        if (emi.status === 'Paid') {
          totalPrincipalPaid += emi.principalComponent;
          totalInterestPaid += emi.interestComponent;
        }
      });
    });

    const outstandingPrincipal = Math.max(0, totalLoansTaken - totalPrincipalPaid);

    return {
      id: member.id,
      name: member.name,
      phone: member.phone,
      totalSavingsPaid,
      totalLoansTaken,
      totalPrincipalPaid,
      totalInterestPaid,
      outstandingPrincipal
    };
  });

  // Calculate Column-wise Grand Totals
  const totalSavings = memberReportRows.reduce((sum, row) => sum + row.totalSavingsPaid, 0);
  const totalLoansDisbursed = memberReportRows.reduce((sum, row) => sum + row.totalLoansTaken, 0);
  const totalPrincipalPaidBack = memberReportRows.reduce((sum, row) => sum + row.totalPrincipalPaid, 0);
  const totalInterestEarned = memberReportRows.reduce((sum, row) => sum + row.totalInterestPaid, 0);
  const totalOutstandingLoan = memberReportRows.reduce((sum, row) => sum + row.outstandingPrincipal, 0);
  const availableFund = Math.max(0, totalSavings + totalInterestEarned + totalPrincipalPaidBack - totalLoansDisbursed);

  // Trigger browser print window (styled via @media print inside tailwind/global css)
  const handlePrint = () => {
    window.print();
  };

  // Export to CSV
  const handleExportCSV = () => {
    // CSV headers
    const headers = language === 'hi' 
      ? ['सदस्य का नाम,फ़ोन नंबर,कुल बचत जमा (₹),कुल ऋण स्वीकृत (₹),भुगतान किया गया मूलधन (₹),भुगतान किया गया ब्याज (₹),बकाया मूलधन (₹)']
      : ['Member Name,Phone,Total Savings Paid (₹),Total Loan Sanctioned (₹),Paid Principal (₹),Paid Interest (₹),Outstanding Principal (₹)'];

    // CSV lines
    const csvRows = memberReportRows.map(row => {
      return `"${row.name.replace(/"/g, '""')}","${row.phone}",${row.totalSavingsPaid},${row.totalLoansTaken},${row.totalPrincipalPaid},${row.totalInterestPaid},${row.outstandingPrincipal}`;
    });

    // Totals line
    const totalsLine = language === 'hi'
      ? `"${language === 'hi' ? 'कुल योग' : 'Grand Total'}",,${totalSavings},${totalLoansDisbursed},${totalPrincipalPaidBack},${totalInterestEarned},${totalOutstandingLoan}`
      : `"Grand Total",,${totalSavings},${totalLoansDisbursed},${totalPrincipalPaidBack},${totalInterestEarned},${totalOutstandingLoan}`;

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...csvRows, totalsLine].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ujjwal_Bhawishya_Samiti_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="reports-section">
      {/* STICKY TOP CONTROLS */}
      <div className="sticky top-24 md:top-16 z-40 bg-[#FAF8F5] pt-2 pb-4 -mx-2 px-2 sm:-mx-0 sm:px-0 space-y-6 print:static print:bg-transparent print:p-0">
        {/* Heading Banner */}
        <div className="bg-[#4a0404] text-[#fdfbf7] p-6 rounded border-b-2 border-[#c5a059] shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden print:bg-white print:text-black print:border-black print:shadow-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/5 rounded-full -mr-10 -mt-10 pointer-events-none print:hidden"></div>
          <div>
            <h1 className="text-xl sm:text-2xl tracking-[0.1em] font-black uppercase font-display text-[#c5a059]">{t.reportsAndSummary}</h1>
            <p className="text-[10px] uppercase tracking-wider text-[#fdfbf7]/80 mt-1 font-sans print:text-black/70">{t.reportsSubtitle}</p>
          </div>

          {/* Print / Export buttons */}
          <div className="flex gap-2 self-start sm:self-auto print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-[#faf5eb] hover:bg-gray-100 text-[#4a0404] border border-[#c5a059]/30 px-3.5 py-2.5 rounded shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-[#c5a059]" />
              {t.printReport}
            </button>
            
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-[#c5a059] hover:bg-[#d4af37] text-[#4a0404] px-3.5 py-2.5 rounded shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              {t.downloadCsv}
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate metrics box */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-4 rounded border-l-4 border-[#4a0404] shadow-sm print:border-black">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{t.totalSavingsReceived}</p>
          <h3 className="text-lg font-bold text-emerald-800 font-mono mt-1 font-serif">₹{totalSavings.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white p-4 rounded border-l-4 border-[#c5a059] shadow-sm print:border-black">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{t.totalLoansDisbursed}</p>
          <h3 className="text-lg font-bold text-amber-800 font-mono mt-1 font-serif">₹{totalLoansDisbursed.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white p-4 rounded border-l-4 border-[#4a0404] shadow-sm print:border-black">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{t.totalOutstandingLoan}</p>
          <h3 className="text-lg font-bold text-rose-800 font-mono mt-1 font-serif">₹{totalOutstandingLoan.toLocaleString('en-IN')}</h3>
        </div>
        <div className="bg-white p-4 rounded border-l-4 border-[#c5a059] shadow-sm print:border-black">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">{t.availableFund}</p>
          <h3 className="text-lg font-bold text-emerald-800 font-mono mt-1 font-serif">₹{availableFund.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded border border-[#c5a059]/20 shadow-sm overflow-hidden print:border-black">
        <div className="p-4 bg-[#faf5eb]/50 border-b border-[#c5a059]/20 font-bold text-xs uppercase tracking-wider text-[#4a0404] flex items-center gap-2 print:bg-white print:border-black">
          <FileSpreadsheet className="w-4.5 h-4.5 text-[#c5a059]" />
          {t.allMembersSummary}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-250 text-gray-700 font-bold print:bg-white print:border-black">
                <th className="p-3.5">{t.memberName}</th>
                <th className="p-3.5 font-mono">{language === 'hi' ? 'कुल जमा (₹)' : 'Total Savings'}</th>
                <th className="p-3.5 font-mono">{language === 'hi' ? 'स्वीकृत ऋण (₹)' : 'Loan Sanctioned'}</th>
                <th className="p-3.5 font-mono">{language === 'hi' ? 'जमा मूलधन (₹)' : 'Paid Principal'}</th>
                <th className="p-3.5 font-mono">{language === 'hi' ? 'जमा ब्याज (₹)' : 'Paid Interest'}</th>
                <th className="p-3.5 font-mono text-rose-850">{t.outstandingPrincipal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono">
              {memberReportRows.map(row => (
                <tr key={row.id} className="hover:bg-[#faf5eb]/20 print:hover:bg-transparent">
                  <td className="p-3.5 font-sans font-bold text-gray-800">{row.name}</td>
                  <td className="p-3.5">₹{row.totalSavingsPaid.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-amber-900 font-semibold">₹{row.totalLoansTaken.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-emerald-800">₹{row.totalPrincipalPaid.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-emerald-800">₹{row.totalInterestPaid.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-rose-800 font-bold">₹{row.outstandingPrincipal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              
              {/* Grand Totals Footer */}
              <tr className="bg-[#faf5eb]/50 border-t-2 border-[#c5a059]/20 font-bold text-gray-800 print:bg-white print:border-black">
                <td className="p-4 font-serif font-bold text-[#4a0404]">
                  {language === 'hi' ? 'कुल योग (Grand Total)' : 'Grand Total'}
                </td>
                <td className="p-4 text-sm font-bold text-[#4a0404]">₹{totalSavings.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm font-bold text-[#4a0404]">₹{totalLoansDisbursed.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm font-bold text-[#4a0404]">₹{totalPrincipalPaidBack.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm font-bold text-[#4a0404]">₹{totalInterestEarned.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm font-bold text-[#4a0404]">₹{totalOutstandingLoan.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Fine-print details for printing */}
      <div className="hidden print:block text-center text-[10px] text-gray-400 mt-12 font-mono">
        Printed on: {new Date().toLocaleString()} | Ujjwal Bhawishya Samiti Passbook Ledger Report
      </div>
    </div>
  );
}
