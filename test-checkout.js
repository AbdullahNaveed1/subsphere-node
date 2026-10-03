const { SubSphere } = require('./index.js');
async function main() {
  const ss = new SubSphere(process.argv[2]);
  const pay = await ss.payments.create({ amount: 7500, method: 'card' }, { idempotencyKey: 'sdk-co-' + Date.now() });
  console.log('PAY', pay.id);
  const cs = await ss.checkout.create({ paymentId: pay.id });
  console.log('CHECKOUT', cs.id, cs.url);
  const fetched = await ss.checkout.get(cs.token);
  console.log('FETCHED', fetched.session.status);
  const ev = await ss.events.trigger('sdk.test', { hello: 'world' });
  console.log('EVENT', ev.id);
}
main().catch(e => { console.log('ERR', e.statusCode, e.message); process.exit(1); });
