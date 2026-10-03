const { SubSphere } = require('./index.js');

async function main() {
  const key = process.argv[2];
  if (!key) { console.error('pass api key as arg'); process.exit(1); }
  const ss = new SubSphere(key);
  try {
    const p = await ss.payments.create({ amount: 5000, method: 'raast', provider: 'safepay' }, { idempotencyKey: 'sdk-order-' + Date.now() });
    console.log('PAYMENT_OK');
    console.log('ID:', p.id);
    console.log('STATUS:', p.status);
    console.log('PROVIDER:', p.provider);
    console.log('HAS_CHECKOUT_URL:', !!p.checkoutUrl);
  } catch (e) {
    console.log('PAYMENT_ERR', e.statusCode, e.message);
    console.log('BODY', JSON.stringify(e.body));
  }
}
main();
