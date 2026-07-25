import { Emi } from '../types';

export function generateEmiSchedule(
  loanId: string,
  memberId: string,
  principal: number,
  interestRate: number,
  durationMonths: number,
  startMonthKey: string // YYYY-MM
): Emi[] {
  const emis: Emi[] = [];
  let outstandingPrincipal = principal;
  
  const [yearStr, monthStr] = startMonthKey.split('-');
  let currentYear = parseInt(yearStr);
  let currentMonth = parseInt(monthStr);

  for (let i = 1; i <= durationMonths; i++) {
    // Increment month (EMI starts the month AFTER the loan is taken)
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    const monthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    // Principal component (rounded to 2 decimals)
    let pComp = Math.round((principal / durationMonths) * 100) / 100;
    if (i === durationMonths) {
      // Adjust last installment for rounding error
      const sumPrev = emis.reduce((sum, item) => sum + item.principalComponent, 0);
      pComp = Math.round((principal - sumPrev) * 100) / 100;
    }

    // Interest component on original principal (Flat Rate: 1 rupee per 100)
    const iComp = Math.round((principal * (interestRate / 100)) * 100) / 100;
    const total = Math.round((pComp + iComp) * 100) / 100;

    emis.push({
      id: `${loanId}_emi_${i}`,
      loanId,
      memberId,
      monthKey,
      emiNumber: i,
      principalComponent: pComp,
      interestComponent: iComp,
      totalAmount: total,
      status: 'Pending',
      paymentDate: null
    });

    outstandingPrincipal = Math.max(0, Math.round((outstandingPrincipal - pComp) * 100) / 100);
  }
  return emis;
}
