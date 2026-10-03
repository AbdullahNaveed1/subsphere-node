export interface CreatePaymentParams {
  amount: number;
  method: 'card' | 'raast' | 'jazzcash' | 'easypaisa' | string;
  currency?: string;
  provider?: string;
  customerEmail?: string;
  metadata?: Record<string, any>;
  simulate?: 'succeeded' | 'failed' | 'pending';
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

export interface CheckoutSession {
  id: string;
  token: string;
  url: string;
  expiresAt: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  payload: string;
  createdAt: string;
}

export class SubSphere {
  constructor(apiKey: string, opts?: { baseUrl?: string; timeoutMs?: number });
  payments: {
    create(params: CreatePaymentParams, opts?: RequestOptions): Promise<Payment>;
    list(): Promise<Payment[]>;
    get(id: string): Promise<Payment>;
  };
  checkout: {
    create(params: { paymentId: string; successUrl?: string; cancelUrl?: string }): Promise<CheckoutSession>;
    get(token: string): Promise<{ session: any; payment: Payment }>;
  };
  events: {
    list(opts?: { since?: string }): Promise<WebhookEvent[]>;
    trigger(type: string, data?: any): Promise<{ id: string; type: string }>;
  };
  subscriptions: {
    create(params: { planId: string }): Promise<any>;
    get(): Promise<any>;
    cancel(): Promise<any>;
  };
  invoices: {
    list(): Promise<any[]>;
    get(id: string): Promise<any>;
    pay(id: string, method?: string): Promise<any>;
  };
  plans: {
    list(): Promise<any[]>;
    get(id: string): Promise<any>;
  };
  webhooks: {
    setEndpoint(url: string, events: string[]): Promise<any>;
    getEndpoint(): Promise<any>;
    events(): Promise<WebhookEvent[]>;
    replay(eventId: string): Promise<{ ok: boolean; eventId: string }>;
  };
  static verifyWebhook(rawBody: string | Buffer, signatureHeader: string, secret: string): boolean;
}
