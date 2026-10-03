const http = require('http');
const https = require('https');
const crypto = require('crypto');

class SubSphere {
  constructor(apiKey, opts = {}) {
    if (!apiKey) throw new Error('SubSphere: apiKey is required');
    this.apiKey = apiKey;
    this.baseUrl = (opts.baseUrl || 'http://localhost:3001/api').replace(/\/$/, '');
    this.timeoutMs = opts.timeoutMs || 30000;
    this.payments = {
      create: (params, o) => this._request('POST', '/v1/payments', params, o),
      list: () => this._request('GET', '/v1/payments'),
      get: (id) => this._request('GET', '/v1/payments/' + id)
    };
    this.refunds = {
      create: (params) => this._request('POST', '/v1/refunds', params),
      list: () => this._request('GET', '/v1/refunds'),
      get: (id) => this._request('GET', '/v1/refunds/' + id)
    };
    this.customers = {
      create: (params) => this._request('POST', '/v1/customers', params),
      list: () => this._request('GET', '/v1/customers'),
      get: (id) => this._request('GET', '/v1/customers/' + id),
      remove: (id) => this._request('DELETE', '/v1/customers/' + id)
    };
    this.checkout = {
      create: (params) => this._request('POST', '/v1/checkout_sessions', params),
      get: (token) => this._request('GET', '/v1/checkout_sessions/' + token)
    };
    this.events = {
      list: (opts = {}) => this._request('GET', '/v1/events' + (opts.since ? '?since=' + encodeURIComponent(opts.since) : '')),
      trigger: (type, data) => this._request('POST', '/v1/events/trigger', { type, data })
    };
    this.subscriptions = {
      create: (params) => this._request('POST', '/subscriptions', params),
      get: () => this._request('GET', '/subscriptions/me'),
      cancel: () => this._request('DELETE', '/subscriptions/me')
    };
    this.invoices = {
      list: () => this._request('GET', '/invoices'),
      get: (id) => this._request('GET', '/invoices/' + id),
      pay: (id, method) => this._request('POST', '/invoices/' + id + '/pay', { method })
    };
    this.plans = {
      list: () => this._request('GET', '/plans'),
      get: (id) => this._request('GET', '/plans/' + id)
    };
    this.webhooks = {
      setEndpoint: (url, events) => this._request('POST', '/webhooks/endpoint', { url, events }),
      getEndpoint: () => this._request('GET', '/webhooks/endpoint'),
      events: () => this._request('GET', '/webhooks/events'),
      replay: (eventId) => this._request('POST', '/webhooks/events/' + eventId + '/replay')
    };
  }

  async _request(method, path, body, opts = {}) {
    const url = new URL(this.baseUrl + path);
    const lib = url.protocol === 'https:' ? https : http;
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'X-API-Key': this.apiKey,
      'Accept': 'application/json'
    };
    if (payload) { headers['Content-Type'] = 'application/json'; headers['Content-Length'] = Buffer.byteLength(payload); }
    if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey;
    return new Promise((resolve, reject) => {
      const req = lib.request({
        hostname: url.hostname, port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search, method, headers, timeout: this.timeoutMs
      }, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          let parsed = data;
          try { parsed = data ? JSON.parse(data) : {}; } catch (_) {}
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
          else { const err = new Error((parsed && parsed.message) || 'Request failed'); err.statusCode = res.statusCode; err.body = parsed; reject(err); }
        });
      });
      req.on('timeout', () => { req.destroy(new Error('SubSphere: request timed out')); });
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  }

  static verifyWebhook(rawBody, signatureHeader, secret) {
    if (!rawBody || !signatureHeader || !secret) return false;
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (signatureHeader.length !== expected.length) return false;
    try { return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signatureHeader, 'utf8')); }
    catch (_) { return false; }
  }
}

module.exports = { SubSphere };
module.exports.default = SubSphere;
