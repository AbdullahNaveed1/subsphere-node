const { SubSphere } = require('./index.js');
async function main() {
  const ss = new SubSphere(process.argv[2]);
  const r = await ss.refunds.create({ paymentId: process.argv[3], amount: 500, reason: 'sdk test' });
  console.log('REFUND_OK', r.id, r.amount, r.status);
  const list = await ss.refunds.list();
  console.log('LIST_LEN', list.length);
}
main().catch(e => { console.log('ERR', e.statusCode, e.message); process.exit(1); });
