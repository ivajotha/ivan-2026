import { Request, Response } from 'express';
import { PaymentRequest, PaymentResponse } from '../interfaces/payment';

export const processPayment = (req: Request, res: Response) => {
  // Simulacion del erreor
  if (req.headers['x-simulate-system-error'] === 'true') 
    {
    return res.status(500).json({
      id: `err-${Math.floor(Math.random() * 100000)}`,
      status: 'error',

      status_detail: 'SnailPay tiene un problema interno y no puede procesar solicitudes',
      transaction_amount: req.body.amount || 0,
      date_created: new Date().toISOString(),
      reference: 'REF-SYS-FAIL',
      payer_id: req.body.userId || 'unknown',
      payer_email: req.body.userEmail || 'unknown',
      cardNumber: req.body.cardNumber || '',
      cvv: req.body.cvv || ''
    });
  }

  const { cardNumber,  expirationDate, cvv, fullName, amount, userId,   userEmail } = req.body as PaymentRequest;


  if (!cardNumber || !expirationDate || !cvv || !fullName || !amount || !userId || !userEmail) 
    {
    return res.status(400).json({ message: 'Faltan parametros obligatorios en la petición.' });
  }

const operationId = `op_${Math.random().toString(36).substring(2, 11)}`;
  const referenceId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  // Cobro exitoso
  if (cardNumber === '1234123412341234' && expirationDate === '12/26' && cvv === '543') 
    {
        if (amount <= 0) 
        {
        return res.status(400).json({ message: 'El monto de la recarga debe ser mayor a cero.' });
        }

        const successResponse: PaymentResponse = {
        id: operationId,
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: amount,
        date_created: new Date().toISOString(),
        authorization_code: `AUTH-${Math.floor(1000 + Math.random() * 9000)}`,
        reference: referenceId,
        payer_id: userId,
        payer_email: userEmail,
        cardNumber,
        cvv
        };

        return res.status(200).json(successResponse);
  }

  // Error Transaccion
  let detail = 'Tarjeta rechazada por fondos insuficientes o parametros incorrectos';
  
  if (cardNumber.startsWith('4')) {
    detail = 'Tarjeta bloqueada';
  } else if (cvv === '000') {
    detail = 'CVV inválido.';
  }

  
  const rejectedResponse: PaymentResponse = {
    id: operationId,
    status: 'rejected',
    status_detail: detail,
    transaction_amount: amount,
    date_created: new Date().toISOString(),
    reference: referenceId,
    payer_id: userId,
    payer_email: userEmail,
    cardNumber,
    cvv
  };

  return res.status(402).json(rejectedResponse);
};
