//app.js
import { getAPIDomain, getCurrentPageInstance, getCurrentPagePath, getCurrentPathWithOptions } from './utils/util'
import { NEED_CRYPT, version,appid } from './utils/config'
import { encrypt, decrypt, getRandomIv } from './utils/crypto'
const ald = require('./utils/ald-stat.js')

App({
  onLaunch: function (options) {
    Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
      );
    };
  },
  onShow(options) {
    let currentPage = getCurrentPageInstance();

    if (currentPage && currentPage.backgroundAudioManager) {
      console.log('play ' + currentPage.route + ', ' + currentPage.backgroundAudioManager.src);
      
      // currentPage.backgroundAudioManager.src = currentPage.data.bgm;
      currentPage.backgroundAudioManager.play();
    }
  },
  onHide: function () {
    let currentPage = getCurrentPageInstance();
    if (getCurrentPages()[0].backgroundAudioManager){
      getCurrentPages()[0].backgroundAudioManager.pause()
    }
    console.log(getCurrentPages()[0].backgroundAudioManager)
    if (currentPage.backgroundAudioManager) {
      currentPage.backgroundAudioManager.pause();
      getCurrentPages()[0].backgroundAudioManager.pause()
    }
    
    if (currentPage.route == 'pages/guess/question/question') {
      // REWARD
      currentPage.netTimeConsumed += currentPage.levelTimeConsumed;
      currentPage.getReward(0);

      // 跳转
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.redirectTo({
          url: '/pages/guess/level-choose/index',
        })
      }
    }
    if (currentPage.route == 'pages/knockout/question/question') {
      // 跳转
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1,
        })
      } else {
        wx.redirectTo({
          url: '/pages/knockout/index/index',
        })
      }
    }
  },
  globalData: {},
  loginUtil: {
    isLogin() {
      let auth = ''
      try {
        auth = wx.getStorageSync("auth")
      } catch (e) { }
      return auth != ''
    },
    currentUser() {
      let auth = ''
      try {
        auth = wx.getStorageSync("auth")
      } catch (e) {
        auth = {}
      }
      return auth.user
    },
    getToken() {
      let auth = ''
      try {
        auth = wx.getStorageSync("auth")
      } catch (e) {
        auth = {}
      }
      return auth.token
    },
    collectFormId(formId) {
      let token = this.getToken();
      if (!token) return;
      let data = {
        form_id: formId,
      }
      wx.request({
        url: `${getAPIDomain()}/api/app/formid/report`,
        header: {
          'TOKEN': token
        },
        data,
      })
    },
    authRequest() {
      return new Promise((resolve, reject) => {
        wx.login({
          success: res => {
            let { code } = res;
            wx.getUserInfo({
              success: (user_info) => {
                let path = getCurrentPathWithOptions();
                let data = JSON.stringify({
                  user_info,
                  type: 'mini_program',
                  code,
                  path,
                });

                data = NEED_CRYPT ? encrypt(data) : data;
                let header = NEED_CRYPT ? {} : { 'NO-CRYPTO': '1' };
                header['App-Version'] = version;
                header['appid'] = appid

                wx.request({
                  url: `${getAPIDomain()}/api/sk/user/auth`,
                  method: 'POST',
                  data,
                  header,
                  success: result => {
                    let { data } = result;
                    data = NEED_CRYPT ? decrypt(data) : data;
                    if (data.errcode === 0) {
                      wx.setStorageSync('auth', data.data);
                      resolve();
                    } else {
                      wx.showToast({
                        title: data.errmsg,
                        icon: 'none',
                        duration: 1500
                      })
                      reject();
                    }
                  },
                  fail: reject
                })
              }
            })
          }
        })
      })
    },
  }
})