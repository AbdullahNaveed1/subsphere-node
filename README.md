# @subsphere/node

Node SDK for SubSphere — payments infrastructure for Pakistani SaaS.

## Install

    npm install @subsphere/node

## Quickstart

    const { SubSphere } = require('@subsphere/node');
    const ss = new SubSphere('sk_test_...');
    const payment = await ss.payments.create({ amount: 5000, method: 'raast' }, { idempotencyKey: 'order-123' });
    console.log(payment.checkoutUrl);

## Verify webhooks

    const ok = SubSphere.verifyWebhook(req.rawBody, req.headers['x-subsphere-signature'], process.env.SUBSPHERE_WEBHOOK_SECRET);
    if (!ok) return res.status(401).end();
