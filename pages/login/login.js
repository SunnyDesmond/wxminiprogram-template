// pages/login/login.js
import {
  getAPIDomain,
  isEmptyObject,
  serialize
} from '../../utils/util'
import {
  SHARE_IMAGE_URL
} from '../../utils/constant'

const App = getApp()

Page({
  data: {

  },
  onLoad: function (options) {
    App.globalData.requestNavigateLock = false
  },
  getUserInfo: function ({
    detail
  }) {
    let {
      errMsg
    } = detail;
    if (errMsg == 'getUserInfo:ok') {
      // this.auth(detail);
      wx.showLoading({
        title: '登录中...',
      })
      App.loginUtil.authRequest()
        .then(res => {
          App.globalData.needRefetchData = true;
          let {
            requestNavigateSource
          } = App.globalData;
          wx.redirectTo({
            url: `/${requestNavigateSource}`,
          })
        })
        .finally(() => {
          wx.hideLoading()
        });
    } else if (errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        title: '取消登录',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showToast({
        title: '授权错误，请重试',
        icon: 'none',
        duration: 1500
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '【有人@你】这是什么歌？答对赢现金红包',
      path: `/pages/index/index?action=`,
      imageUrl: SHARE_IMAGE_URL
    }
  }
})