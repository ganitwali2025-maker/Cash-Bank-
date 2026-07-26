import React from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar,
  BarChart,
  Users,
  Briefcase,
  User,
  FileText,
  PieChart,
  Clock
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
    const memberDeposits = deposits.filter(d => d.memberId === member.id && d.status === 'Paid');
    const totalSavingsPaid = memberDeposits.reduce((sum, d) => sum + d.amount, 0);

    const memberLoans = loans.filter(l => l.memberId === member.id);
    const totalLoansTaken = memberLoans.reduce((sum, l) => sum + l.principal, 0);

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

  const totalSavings = memberReportRows.reduce((sum, row) => sum + row.totalSavingsPaid, 0);
  const totalLoansDisbursed = memberReportRows.reduce((sum, row) => sum + row.totalLoansTaken, 0);
  const totalPrincipalPaidBack = memberReportRows.reduce((sum, row) => sum + row.totalPrincipalPaid, 0);
  const totalInterestEarned = memberReportRows.reduce((sum, row) => sum + row.totalInterestPaid, 0);
  const totalOutstandingLoan = memberReportRows.reduce((sum, row) => sum + row.outstandingPrincipal, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = language === 'hi' 
      ? ['सदस्य का नाम,फ़ोन नंबर,कुल बचत जमा (₹),कुल ऋण स्वीकृत (₹),भुगतान किया गया मूलधन (₹),भुगतान किया गया ब्याज (₹),बकाया मूलधन (₹)']
      : ['Member Name,Phone,Total Savings Paid (₹),Total Loan Sanctioned (₹),Paid Principal (₹),Paid Interest (₹),Outstanding Principal (₹)'];

    const csvRows = memberReportRows.map(row => {
      return `"${row.name.replace(/"/g, '""')}","${row.phone}",${row.totalSavingsPaid},${row.totalLoansTaken},${row.totalPrincipalPaid},${row.totalInterestPaid},${row.outstandingPrincipal}`;
    });

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

  const reportCards = [
    { icon: <Calendar className="w-6 h-6 text-red-500 mb-2" />, label: 'Daily Report', bg: 'bg-red-50' },
    { icon: <Calendar className="w-6 h-6 text-green-500 mb-2" />, label: 'Monthly Report', bg: 'bg-green-50' },
    { icon: <BarChart className="w-6 h-6 text-blue-500 mb-2" />, label: 'Yearly Report', bg: 'bg-blue-50' },
    { icon: <Users className="w-6 h-6 text-green-600 mb-2" />, label: 'Collection Report', bg: 'bg-green-50' },
    { icon: <Briefcase className="w-6 h-6 text-orange-500 mb-2" />, label: 'Loan Report', bg: 'bg-orange-50' },
    { icon: <User className="w-6 h-6 text-purple-500 mb-2" />, label: 'Member Report', bg: 'bg-purple-50' },
    { icon: <FileText className="w-6 h-6 text-blue-500 mb-2" />, label: 'Expense Report', bg: 'bg-blue-50' },
    { icon: <PieChart className="w-6 h-6 text-emerald-500 mb-2" />, label: 'Profit Report', bg: 'bg-emerald-50' },
    { icon: <Clock className="w-6 h-6 text-blue-600 mb-2" />, label: 'Interest Report', bg: 'bg-blue-50' },
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24 font-sans" id="reports-section">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center justify-center sticky top-0 z-10 print:hidden">
        <h1 className="text-lg font-bold tracking-wider uppercase font-display">Reports</h1>
      </div>

      <div className="p-4 space-y-6 pt-6">
        
        {/* FINANCIAL REPORTS GRID */}
        <div className="print:hidden">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000] mb-4">Financial Reports</h3>
          <div className="grid grid-cols-3 gap-3">
            {reportCards.map((card, idx) => (
              <button key={idx} className={`flex flex-col items-center justify-center p-3 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 ${card.bg} hover:brightness-95 transition-all aspect-square`}>
                {card.icon}
                <span className="text-[9px] font-bold text-gray-800 text-center leading-tight">{card.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8 print:hidden border-t border-gray-100 pt-6">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#5A0000]">{t.consolidatedLedger}</h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2.5 rounded-[12px] transition-colors shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              {language === 'hi' ? 'एक्सेल' : 'Excel'}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-bold bg-[#5A0000] hover:bg-[#4a0404] text-white px-4 py-2.5 rounded-[12px] transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              {t.printSavePdf}
            </button>
          </div>
        </div>

        {/* Aggregate Totals Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 print:grid-cols-5 mb-4">
          <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Total Savings</p>
            <p className="font-bold text-gray-900 text-center">₹{totalSavings.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Total Loan Sanctioned</p>
            <p className="font-bold text-gray-900 text-center">₹{totalLoansDisbursed.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Paid Principal</p>
            <p className="font-bold text-green-600 text-center">₹{totalPrincipalPaidBack.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Paid Interest</p>
            <p className="font-bold text-[#D4AF37] text-center">₹{totalInterestEarned.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100 md:col-span-1 col-span-2">
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 text-center">Total Outstanding</p>
            <p className="font-bold text-red-600 text-center">₹{totalOutstandingLoan.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider">{t.memberName}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider">{t.phone}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider text-right">{t.totalSavingsPaid}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider text-right">{t.totalLoanSanctioned}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider text-right text-green-700 bg-green-50/50">{t.paidPrincipal}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider text-right text-green-700 bg-green-50/50">{t.paidInterest}</th>
                  <th className="p-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wider text-right text-red-700 bg-red-50/50">{t.outstandingPrincipal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {memberReportRows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 sm:px-4 text-gray-900 font-bold">{row.name}</td>
                    <td className="p-3 sm:px-4 text-gray-500">{row.phone}</td>
                    <td className="p-3 sm:px-4 text-right text-gray-900">₹{row.totalSavingsPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3 sm:px-4 text-right text-gray-900">₹{row.totalLoansTaken.toLocaleString('en-IN')}</td>
                    <td className="p-3 sm:px-4 text-right text-green-600 bg-green-50/20">₹{row.totalPrincipalPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3 sm:px-4 text-right text-[#D4AF37] bg-green-50/20">₹{row.totalInterestPaid.toLocaleString('en-IN')}</td>
                    <td className="p-3 sm:px-4 text-right text-red-600 bg-red-50/20">₹{row.outstandingPrincipal.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {memberReportRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 font-medium italic">
                      {language === 'hi' ? 'कोई डेटा नहीं मिला।' : 'No data found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
