export interface PaymentRequest 
{
  cardNumber: string;
    expirationDate: string;

  cvv: string;
  fullName: string;
  amount: number;
  userId: string;
  userEmail: string;
}

export interface PaymentResponse 
{
  id: string;
  status: 'approved' | 'rejected' | 'error';

  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code?: string;
  reference: string;
  payer_id: string;
  payer_email: string;
  cardNumber: string;
    
  cvv: string;
}
