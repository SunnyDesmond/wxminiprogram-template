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
    count: 20,
    isLoading: true,
    isShowNone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.switchList({
      currentTarget: {
        dataset: {
          index: 1
        }
      }
    })
  },
  switchList: function(options) {
    this.setData({
      isShowNone:false
    })
    console.log(options)
    let {
      index
    } = options.currentTarget.dataset
    this.setData({
      chooseIndex: index,
      page: 1,
      detailtList: []
    })

    this.fetchList()
  },
  //查询直接好友奖励
  fetchList: function() {
    wx.showLoading({
      title: '加载中',
    })
    GET(`share/get_earning_list?type=${this.data.chooseIndex}&page=${this.data.page}&count=${this.data.count}`).then(res => {
      let pageTotal = Math.ceil(res.total / this.data.count);
      let tmpArr = this.data.detailtList || [];
      if (res.data.length == 0){
        this.setData({
          isShowNone: true
        })
      }else{
        this.setData({
          isShowNone: false
        })
      }
      tmpArr.push.apply(tmpArr, res.data);
      this.setData({
        detailtList: tmpArr,
        pageTotal: pageTotal
      })
    }).finally(() => {
      wx.hideLoading()
    });
  },
  //加载更多数据
  onbindEvent: function() {
    if (this.data.isLoading) {
      this.setData({
        isLoading: false
      })
      if (this.data.pageTotal <= this.data.page) return
      this.setData({
        isHideLoadMore: false
      })
      this.data.page++
        this.fetchList()
    }
  },
  toRules: function() {
    wx.navigateTo({
      url: '../rules/rules',
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