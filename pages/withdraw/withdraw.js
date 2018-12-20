import {
  GET
} from '../../utils/request';
import {
  SHARE_IMAGE_URL,
  SHARE_TITLE,
  SHARE_TO_FRIENDS_IMAGE_URL
} from '../../utils/constant';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentAmount: options.currentAmount
    })
  },

  //金额列表
  fetchList: function() {
    GET('share/get_withdraw_list').then(res => {
      this.setData({
        amountList: res
      })
    });
  },
  //微信号
  bindKeyWechat: function(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  //电话号码
  bindKeyMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  //金额提现
  withdrawAmount: function() {
    if (this.checkPhone()) {
      wx.showLoading({
        title: '加载中',
        success: () => {
          GET(`share/withdraw?mobile=${this.data.mobile}&wechat=${this.data.wechat}&amount=${this.data.currentAmount}`).then(res => {
            if (res) {
              this.setData({
                showModal: true
              })
            }
            console.log(res)
          }).finally(() => {
            wx.hideLoading()
          });
        }
      })

    }
  },
  //校验手机号码和微信号是否为空
  checkPhone: function() {
    if (!this.data.wechat) return wx.showToast({
      title: '请输入微信账号',
      icon: 'none',
      duration: 1500
    })
    if (!(/^1[0-9]{10}$/.test(this.data.mobile))) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    return true
  },
  hideModal: function() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (getCurrentPages()[0].backgroundAudioManager) {
      getCurrentPages()[0].backgroundAudioManager.play()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let shareUrl = `/pages/index/index`,
      shareImageUrl = SHARE_IMAGE_URL,
      shareTitle = SHARE_TITLE;
    return {
      title: shareTitle,
      path: shareUrl,
      imageUrl: shareImageUrl,
    }
  }
})