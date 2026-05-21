export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'card' | 'mobile_money' | 'pay_at_property';

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_reference: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInput {
  booking_id: string;
  method: PaymentMethod;
  amount: number;
  currency?: string;
  transaction_reference?: string;
}
