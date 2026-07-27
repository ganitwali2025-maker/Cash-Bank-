export function numberToWords(amount: number): string {
  if (amount === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWords = (num: number): string => {
    if (num === 0) return '';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numToWords(num % 100) : '');
  };

  const convert = (num: number): string => {
    if (num === 0) return 'Zero';
    
    let words = '';
    
    // Indian Numbering System: Crores, Lakhs, Thousands, Hundreds
    const crores = Math.floor(num / 10000000);
    const lakhs = Math.floor((num % 10000000) / 100000);
    const thousands = Math.floor((num % 100000) / 1000);
    const remainder = num % 1000;

    if (crores > 0) words += numToWords(crores) + ' Crore ';
    if (lakhs > 0) words += numToWords(lakhs) + ' Lakh ';
    if (thousands > 0) words += numToWords(thousands) + ' Thousand ';
    if (remainder > 0) words += numToWords(remainder);
    
    return words.trim();
  };

  const integerPart = Math.floor(amount);
  // For this banking app, we mostly deal with integers, but we can handle decimals if needed.
  let result = convert(integerPart);
  
  return result + ' Only';
}
