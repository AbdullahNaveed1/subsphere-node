const { SubSphere } = require('./index.js');

async function main() {
  const key = process.argv[2];
  if (!key) { console.error('usage: node test-full.js <api-key>'); process.exit(1); }
  const ss = new SubSphere(key);
  const stamp = Date.now();
  const log = (n, v) => console.log(('[' + n + ']').padEnd(14), typeof v === 'string' ? v : JSON.stringify(v).slice(0, 90));

  try {
    const plans = await ss.plans.list();
    log('plans.list', plans.length + ' plans');

    const pay = await ss.payments.create({ amount: 5000, method: 'raast', simulate: 'succeeded' }, { idempotencyKey: 'e2e-pay-' + stamp });
    log('payments.create', pay.id + ' ' + pay.status);

    const got = await ss.payments.get(pay.id);
    log('payments.get', got.status);

    const cust = await ss.customers.create({ email: 'e2e-' + stamp + '@x.com', name: 'E2E' });
    log('customers.create', cust.email);

    const coupon = await ss.coupons.create({ code: 'E2E' + stamp, discountType: 'percent', discountValue: 10 });
    log('coupons.create', coupon.code);

    const payForCo = await ss.payments.create({ amount: 5000, method: 'raast' }, { idempotencyKey: 'e2e-pay-co-' + stamp });
    const cs = await ss.checkout.create({ paymentId: payForCo.id });
    log('checkout.create', cs.url);
    const csf = await ss.checkout.get(cs.token);
    log('checkout.get', csf.session.status);

    const link = await ss.paymentLinks.create({ amount: 2500, description: 'E2E link' });
    log('paymentLinks.create', link.url);
    const links = await ss.paymentLinks.list();
    log('paymentLinks.list', links.length + ' links');

    const refund = await ss.refunds.create({ paymentId: pay.id, amount: 100, reason: 'e2e' });
    log('refunds.create', refund.id + ' ' + refund.status);

    const inv = await ss.invoices.list();
    log('invoices.list', inv.length + ' invoices');

    const ev = await ss.events.trigger('e2e.test', { stamp });
    log('events.trigger', ev.id);
    const evl = await ss.events.list();
    log('events.list', evl.length + ' events');

    console.log('\nALL E2E STEPS PASSED');
  } catch (e) {
    console.error('FAILED at step:', e.statusCode, e.message);
    if (e.body) console.error(e.body);
    process.exit(1);
  }
}

main();