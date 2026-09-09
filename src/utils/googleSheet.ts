// ============================================================
// Google Sheet Service - Cash Bank App
// Web App URL: Ujjwal Samiti Data Management
// ============================================================

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbylJG300iJuV4Ue7qSPFFJOeP8V9n6gO2ZWihN69zwmoTsHwUTNHArSwrUfrV7H-j2aTA/exec';

export interface DepositPayload {
  action: 'addDeposit' | 'updateDeposit' | 'deleteDeposit';
  memberId: string;
  memberName: string;
  month: string;
  date: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'A/C Transfer';
  depositType: 'Saving Account' | 'Loan Account';
  remark?: string;
  status: 'Paid' | 'Pending';
}

export interface MemberPayload {
  action: 'addMember' | 'updateMember' | 'deleteMember';
  id: string;
  name: string;
  phone: string;
  monthlyDeposit: number;
  joiningDate: string;
  status?: 'Active' | 'Inactive';
}

// Google Sheet mein deposit save karo
export async function saveDepositToSheet(payload: DepositPayload): Promise<boolean> {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // Apps Script ke liye text/plain use karo
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === 'success') {
      console.log('✅ Sheet mein deposit save ho gaya:', result.data);
      return true;
    } else {
      console.error('❌ Sheet error:', result.message);
      return false;
    }
  } catch (err) {
    console.error('❌ Network error:', err);
    return false;
  }
}

// Google Sheet mein member save karo
export async function saveMemberToSheet(payload: MemberPayload): Promise<boolean> {
  try {
    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.status === 'success') {
      console.log('✅ Sheet mein member save ho gaya:', result.data);
      return true;
    } else {
      console.error('❌ Sheet error:', result.message);
      return false;
    }
  } catch (err) {
    console.error('❌ Network error:', err);
    return false;
  }
}
