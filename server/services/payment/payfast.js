import crypto from 'crypto';

export function generatePayFastSignature(data, passPhrase = null) {
  let pfOutput = '';
  for (let key in data) {
    if (data.hasOwnProperty(key) && key !== 'signature' && data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
    }
  }
  pfOutput = pfOutput.slice(0, -1);
  if (passPhrase !== null) {
    pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(pfOutput).digest('hex');
}
