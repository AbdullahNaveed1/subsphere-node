const { SubSphere } = require('./index.js');

async function main() {
  const apiKey = process.env.SUBSPHERE_API_KEY || 'sk_test_placeholder';
  const ss = new SubSphere(apiKey);
  console.log('SDK loaded. Base URL:', ss.baseUrl);
  console.log('Has payments.create:', typeof ss.payments.create);
  console.log('Has verifyWebhook:', typeof SubSphere.verifyWebhook);
  const ok = SubSphere.verifyWebhook('hello', 'deadbeef', 'secret');
  console.log('verifyWebhook with bad sig (should be false):', ok);
  const crypto = require('crypto');
  const body = 'hello';
  const secret = 'secret';
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
  console.log('verifyWebhook with good sig (should be true):', SubSphere.verifyWebhook(body, sig, secret));
}

main().catch(e => { console.error('FAIL', e); process.exit(1); });
