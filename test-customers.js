const { SubSphere } = require('./index.js');
async function main() {
  const ss = new SubSphere(process.argv[2]);
  const c = await ss.customers.create({ email: 'sdk-cust-' + Date.now() + '@x.com', name: 'SDK Customer' });
  console.log('CUSTOMER_OK', c.id, c.email);
  const list = await ss.customers.list();
  console.log('LIST_LEN', list.length);
  const got = await ss.customers.get(c.id);
  console.log('GET_OK', got.id);
  await ss.customers.remove(c.id);
  console.log('DELETE_OK');
}
main().catch(e => { console.log('ERR', e.statusCode, e.message); process.exit(1); });
