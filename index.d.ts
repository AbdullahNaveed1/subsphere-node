export interface CreatePaymentParams {
  amount: number;
  method: 'card' | 'raast' | 'jazzcash' | 'easypaisa' | string;
  currency?: string;
  provider?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  orgId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  method: string;
  provider: string;
  providerRef?: string;
  checkoutUrl?: string;
  createdAt: string;
}

export interface RequestOptions { idempotencyKey?: string; }

export class SubSphere {
  constructor(apiKey: string, opts?: { baseUrl?: string; timeoutMs?: number });
  payments: {
    create(params: CreatePaymentParams, opts?: RequestOptions): Promise<Payment>;
    list(): Promise<Payment[]>;
    get(id: string): Promise<Payment>;
  };
  static verifyWebhook(rawBody: string | Buffer, signatureHeader: string, secret: string): boolean;
}
