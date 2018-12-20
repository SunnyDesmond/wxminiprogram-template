import CryptoJS from '../vendor/crypto-js/crypto-js'
import Base64 from './base64'

const sessionKey = '114DCCE3B3AB4E143C9D23D059846DF0';

const encrypt = (data) => {
  let key = CryptoJS.enc.Utf8.parse(sessionKey);
  let ivStr = getRandomIv();
  let iv = CryptoJS.enc.Utf8.parse(ivStr);
  if (typeof data == 'object' && data != null) data = JSON.stringify(data);

  let encryptedData = CryptoJS.AES.encrypt(data, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  return {
    data: Base64.encode(encryptedData.toString()),
    iv: ivStr,
  }
}

const decrypt = ({ data, iv }) => {
  let key = CryptoJS.enc.Utf8.parse(sessionKey);
  iv = CryptoJS.enc.Utf8.parse(iv);
  data = Base64.decode(data);

  let decryptedData = CryptoJS.AES.decrypt(data, key, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  let result = CryptoJS.enc.Utf8.stringify(decryptedData);
  return JSON.parse(result)
}

const getRandomIv = () => {
  return CryptoJS.MD5(new Date().getTime()).toString().substr(0, 16)
}

export {
  encrypt,
  decrypt,
  getRandomIv,
}