// pages/welfare-center/welfare-center.js
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.fetchSignInfo()
    this.fetchUserInfo()
  },
  //隐藏模态框
  hideModal: function() {
    this.setData({
      isShowShadow: false,
      isShowSign: false,
      isShowCoinModal: false,
      isShowFail: false,
      isShowSignClose: false,
      checkRaider: false,
      checkService: false,
      isShowModalSign: false
    })
    clearTimeout(this.luckyTime)
  },
  //打开签到模态框
  openSignModal: function() {
    wx.reportAnalytics('welfare_page_click_stat', {
      area: `area_open_sign`,
    })
    this.setData({
      isShowSign: true,
      isShowSignClose: true
    })
  },
  //查看攻略
  checkRaiders: function() {
    wx.reportAnalytics('welfare_page_click_stat', {
      area: `area_open_raider`,
    })
    this.setData({
      isShowShadow: true,
      checkRaider: true,
      isShowSignClose: true
    })
    this.fetchLuckyTips()
  },
  //咨询客服
  checkService: function() {
    wx.reportAnalytics('welfare_page_click_stat', {
      area: `area_open_service`,
    })
    this.setData({
      isShowShadow: true,
      checkService: true,
      isShowSignClose: true
    })
    this.fetchCoinTips()
  },
  //获取金币数据
  fetchUserInfo: function() {
    GET('user/info').then(res => {
      this.setData({
        coin_num: res.coin_num,
        userInfo: res
      })
    }).finally(() => {
      wx.hideLoading()
    });
  },
  //获取签到数据
  fetchSignInfo: function() {
    GET('user/sign/daily/config').then(res => {
      this.setData({
        signInfo: res,
        conDay: res.conDay,
        status: res.status
      })
    });

  },
  //签到
  signClick: function() {
    GET('user/sign/daily').then(res => {
      let {
        result,
        conDay,
        coinNum
      } = res
      if (result == 1) {
        this.setData({
          signConDay: conDay,
          status: 1,
          signCoinNum: coinNum,
          isShowModalSign: true,
          isShowShadow: true,
          isShowSign: false,
          isShowSignClose: false
        })
        setTimeout(() => {
          this.setData({
            isShowModalSign: false,
            isShowShadow: false
          })
        }, 2000)
        this.fetchUserInfo();
      }
    });
  },
  //拼手气
  luckActivity: function() {
    wx.reportAnalytics('welfare_page_click_stat', {
      area: `area_lucky`,
    })
    wx.showLoading({
      title: '加载中'
    })
    GET('user/welfare/luck').then(res => {
      if (res.result == 1) {
        this.setData({
          isShowCoinModal: true,
          isShowShadow: true,
          coinNumSuccess: res.coinNum
        })
        this.luckyTime = setTimeout(() => {
          this.setData({
            isShowCoinModal: false,
            isShowShadow: false,
          })
        }, 2000)
        this.fetchUserInfo();
      } else {
        this.setData({
          isShowFail: true,
          isShowShadow: true,
        })
        this.luckyTime = setTimeout(() => {
          this.setData({
            isShowFail: false,
            isShowShadow: false,
          })
        }, 2000)
      }
    }).finally(() => {
      wx.hideLoading()
    });;

  },
  //拼手气小提示
  fetchLuckyTips: function() {
    GET('luck/tips').then(res => {
      this.setData({
        luckTips: res.tips
      })
    });
  },
  //获取金币小提示
  fetchCoinTips: function() {
    GET('coin/tips').then(res => {
      this.setData({
        coinTips: res.tips
      })
    });
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
    if (getCurrentPages()[1].route == 'pages/start-game/start-game') {
      getCurrentPages()[0].backgroundAudioManager.src = getCurrentPages()[0].data.bgm
      getCurrentPages()[0].backgroundAudioManager.onEnded((res) => {
        getCurrentPages()[0].backgroundAudioManager.src = getCurrentPages()[0].data.bgm
      })

    } else {
      if (getCurrentPages()[0].backgroundAudioManager) {
        getCurrentPages()[0].backgroundAudioManager.play()
      }
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    getCurrentPages()[0].backgroundAudioManager.pause()
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