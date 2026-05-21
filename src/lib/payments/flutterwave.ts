/**
 * Flutterwave API Wrapper
 * Handles initialization and verification of payments.
 */

const FLUTTERWAVE_ENDPOINT = 'https://api.flutterwave.com/v3';

export interface FlutterwaveInitializeResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

export interface FlutterwaveVerifyResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    customer: {
      name: string;
      email: string;
    };
  };
}

export const flutterwave = {
  /**
   * Initialize a Flutterwave Standard payment redirect
   */
  async initializePayment(payload: {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    customer: {
      email: string;
      name: string;
    };
    customizations: {
      title: string;
      description: string;
      logo?: string;
    };
  }): Promise<FlutterwaveInitializeResponse> {
    const response = await fetch(`${FLUTTERWAVE_ENDPOINT}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to initialize payment');
    }

    return data;
  },

  /**
   * Verify a transaction using its ID (returned in redirect URL)
   */
  async verifyTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse> {
    const response = await fetch(`${FLUTTERWAVE_ENDPOINT}/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify transaction');
    }

    return data;
  },
};
