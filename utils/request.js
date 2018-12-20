import {
  NEED_CRYPT,
  version,
  appid
} from './config'
import {
  getAPIDomain,
  getCurrentPathWithOptions,
  isEmptyObject,
  serialize
} from './util'
import {
  encrypt,
  decrypt
} from './crypto'

const App = getApp();
const request = (method = 'GET') => {
  return (url, data = {}) => {
    return new Promise(function (resolve, reject) {
      url = /^https?\:\/\//i.test(url) ? url : `${getAPIDomain()}/api/sk/${url}`;

      let token = App.loginUtil.getToken();
      let header = {
        'TOKEN': token,
        'App-Version': version,
        'appid': appid
      };
      if (!NEED_CRYPT) {
        header['NO-CRYPTO'] = '1';
      } else if (method == 'POST') {
        data = encrypt(data);
      }

      wx.request({
        url,
        data,
        method,
        header,
        success: function ({
          statusCode,
          data
        }) {
          if (statusCode == 200 && data) {
            data = NEED_CRYPT ? decrypt(data) : data;
            if (data.errcode == 0) {
              // resolve(data)
              resolve(data.data);
            } else if (data.errcode == 10001 || data.errcode == 10002) {
              let currentPage = getCurrentPathWithOptions();
              wx.removeStorage({
                key: "auth"
              })
              if (App.globalData.requestNavigateLock || currentPage == 'pages/login/login') return;
              App.globalData.requestNavigateLock = true;
              App.globalData.requestNavigateSource = currentPage;

              wx.redirectTo({
                url: '/pages/login/login',
                success: () => (console.log('request navigate ==> success')),
                fail: () => (console.log('request navigate ==> fail')),
              })
            } else if (data.errcode >= 30000) {
              wx.showToast({
                title: data.errmsg,
                icon: 'none',
                duration: 1500
              })
              reject(data);
            }
          } else {
            reject('请求错误，请稍后再试');

          }
        },
        fail: function (err) {
          reject('请求不符合规范，请检查域名是否符合要求');
        }
      });
    })
  }
}

export const GET = request('GET');
export const POST = request('POST');
export default request;