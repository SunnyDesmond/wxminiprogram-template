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
  onShow: function() {
    wx.showLoading({
      title: '加载中...',
    })
    if (getCurrentPages()[0].backgroundAudioManager.src !== 'https://img.jammyfm.com/media/image/songquiz_assets/idol-bgm.mp3') {
      getCurrentPages()[0].backgroundAudioManager.src = getCurrentPages()[0].data.bgm
      getCurrentPages()[0].backgroundAudioManager.onEnded((res) => {
        getCurrentPages()[0].backgroundAudioManager.src = getCurrentPages()[0].data.bgm
      })
    }
    if (getCurrentPages()[0].backgroundAudioManager) {
      getCurrentPages()[0].backgroundAudioManager.play()
    }

    // console.log(getCurrentPages())
    this.fetchGoodsInfo()
    // if (getCurrentPages()[0].backgroundAudioManager){
    //   console.log(getCurrentPages()[0].backgroundAudioManager.play()) 
    // }
  },
  //查询商品数据
  fetchGoodsInfo: function() {
    GET('user/goods').then(res => {
      this.setData({
        goodList: res
      })
    }).finally(() => {
      wx.hideLoading()
    });
  },
  //我要礼品
  toGetGift: function() {
    wx.navigateBack({

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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