/**
 * Payment Gateway Helper & Contract for Eventku
 * 
 * Supports Midtrans Snap & Xendit Invoice integration.
 * In production, server keys are securely kept server-side and never exposed to the client.
 */

export interface PaymentTransactionPayload {
  orderCode: string;
  grossAmount: number;
  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  itemDetails: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface PaymentTransactionResult {
  token?: string;
  redirectUrl?: string;
  paymentMethod?: string;
  status: 'pending' | 'success' | 'failed';
}

/**
 * Creates Midtrans Snap transaction token via official Midtrans API.
 * Server-side route handler: POST /api/payment/create-snap
 */
export async function createMidtransSnapTransaction(
  payload: PaymentTransactionPayload
): Promise<PaymentTransactionResult> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const isProd = process.env.MIDTRANS_IS_PRODUCTION === 'true';

  if (!serverKey) {
    return {
      status: 'pending',
      paymentMethod: 'sandbox_simulation',
      redirectUrl: undefined,
    };
  }

  const endpoint = isProd
    ? 'https://app.midtrans.com/snap/v1/transactions'
    : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

  const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: payload.orderCode,
        gross_amount: payload.grossAmount,
      },
      customer_details: {
        first_name: payload.customerDetails.fullName,
        email: payload.customerDetails.email,
        phone: payload.customerDetails.phone,
      },
      item_details: payload.itemDetails.map((item) => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name.slice(0, 50),
      })),
    }),
  });

  const data = await response.json();
  return {
    token: data.token,
    redirectUrl: data.redirect_url,
    status: 'pending',
  };
}

