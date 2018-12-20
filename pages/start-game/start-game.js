// pages/start-game/start-game.js
import {
  apiDomain
} from '../../utils/config'
import {
  SHARE_IMAGE_URL,
  SHARE_TITLE,
  SHARE_TO_FRIENDS_IMAGE_URL
} from '../../utils/constant';
import {
  GET
} from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgm: 'https://img.jammyfm.com/media/image/songquiz_assets/mxtkgo/bg_audio.mp3',
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

    let {
      proid = ""
    } = options;
    this.setData({
      goodsId: proid
    })

    this.setData({
      costCoinNum: options.coinNum
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: () => {
        this.fetchGoodDetail(proid)
      }
    })
    this.initMusic()


  },
  //challenge线上挑战 try 试玩
  starChallenge: function (options) {

    let v = Math.random();
    let { params } = options.currentTarget.dataset
    let tryUrl = `${apiDomain}/mxtkgo/index1.html?avatar=${this.data.goodsInfo.idol_img}&v=${v}`;
    let challengeUrl = `${apiDomain}/mxtkgo/index.html?avatar=${this.data.goodsInfo.idol_img}&v=${v}`;

    if (params == 'challenge') {
      wx.reportAnalytics('start_game_click_stat', {
        area: `start_btn`,
      })

      wx.showLoading({
        title: '加载中...',
        mask: true,
        success: () => {
          // 检查用户当前的金币
          GET(`user/check/${this.data.goodsId}`).then(res => {
            wx.hideLoading()
            console.log(res)
            //数据统计用户经济能力
            wx.reportAnalytics('start_game_economic_cap', {
              coin_num: res.coinNum,
              check: res.result
            })
            //-1 金币不足
            if (res.result == -1) {
              this.setData({
                isShowModal: true
              })
            } else if (res.result == 1) {
              // 1 足够金币
              this.backgroundAudioManager.stop();
              GET('user/cost-coin', { id: this.data.goodsId }).then(res => {
                let gameId = res.gameId;
                this.setData({
                  gameId
                })
              }).then(res=>{
                // gamemode=0 付费 1：试玩
                wx.navigateTo({
                  url: `/pages/game/game?goodsId=${this.data.goodsId}&currentUrl=${encodeURIComponent(challengeUrl)}&gamemode=0&gameId=${this.data.gameId}`
                })
              })
             

            } else if (res.result == -2) {
              //-2限制中奖一次
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }).finally(() => {

          })
        }
      })
    }
    if (params == 'try') {
      wx.reportAnalytics('start_game_click_stat', {
        area: `try_btn`,
      })
      wx.navigateTo({
        url: `/pages/game/game?currentUrl=${encodeURIComponent(tryUrl)}&goodsId=${this.data.goodsId}&gamemode=1`
      })
    }

  },

  //获取金币数据
  fetchUserInfo: function () {
    GET('user/info').then(res => {
      this.setData({
        userInfo: res
      })
    });
  },
  //查询头像，金币
  fetchGoodDetail: function (id) {
    GET(`goods/detail?id=${id}`).then(res => {
      this.setData({
        goodsInfo: res
      })
    }).finally(() => {
      wx.hideLoading()
    });
  },
  //初始化背景音乐 跟游戏页面保持一致
  initMusic: function () {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    // 防止页面加载，多次加载音频
    let bgm = 'https://img.jammyfm.com/media/image/songquiz_assets/mxtkgo/bg_audio.mp3'
    this.backgroundAudioManager.title = '背景音乐'
    this.backgroundAudioManager.src = bgm
    this.backgroundAudioManager.onEnded((res) => {
      this.backgroundAudioManager.title = '背景音乐'
      this.backgroundAudioManager.src = bgm
    })
  },
  //领取福利，前往福利中心
  toWelfare: function () {
    wx.navigateTo({
      url: '/pages/welfare-center/welfare-center',
    })
  },
  //点击购买
  buyGoods: function () {
    wx.reportAnalytics('start_game_click_stat', {
      area: `buy_btn`,
    })
    wx.showToast({
      title: '该商品已售空，游戏闯关成功仍可免费获得',
      icon: 'none',
      duration: 1500
    })
    this.setData({
      isShowModal: false
    })
  },
  //隐藏modal
  hideModal: function () {
    this.setData({
      isShowModal: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    getCurrentPages()[1].backgroundAudioManager.src = this.data.bgm
    getCurrentPages()[0].backgroundAudioManager.stop()
    this.fetchUserInfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */

  onHide: function () {


  },

  /**
   * 生命周期函数--监听页面卸载
   */

  onUnload: function () {
    // let indexPageInstance = getCurrentPages()[0];
    // indexPageInstance.backgroundAudioManager.src = indexPageInstance.data.bgm;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  onPullDownRefresh: function () {


  },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function () {


  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function () {
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