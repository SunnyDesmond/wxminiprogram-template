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
    page:1,
    count:20,
    isLoading: true,
    isShowNone:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //可提现金额数
  fetchAllowAmount: function () {
    GET('share/get_available_amount').then(res => {
      this.setData({
        totalAmount: res.amount,
        amountLimit: res.limit
      })
      console.log(res)

    });
  },
  //金额列表
  fetchList: function () {
    wx.showLoading({
      title: '加载中',
    })
    GET(`share/get_withdraw_list?page=${this.data.page}&count=${this.data.count}`).then(res => {
      let pageTotal = Math.ceil(res.total / this.data.count);
      let tmpArr = this.data.amountList || [];
      console.log(tmpArr)
      if (res.data.length == 0){
        this.setData({
          isShowNone:true
        })
      }else{
        this.setData({
          isShowNone: false
        })
      }
      tmpArr.push.apply(tmpArr, res.data);
      this.setData({
        amountList: tmpArr,
        pageTotal: pageTotal
      })
      console.log(res)
    }).finally(()=>{
      wx.hideLoading()
    });
  },
  //加载更多
  onbindEvent: function (event) {
    console.log(!this.data.isHideLoadMore)
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
  applyWithdraw:function(){
    wx.navigateTo({
      url: `/pages/withdraw/withdraw?currentAmount=${this.data.totalAmount}`,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  /**
* 生命周期函数--监听页面显示
*/
  onShow: function () {
    console.log(getCurrentPages()[0].backgroundAudioManager)
    if (getCurrentPages()[0].backgroundAudioManager) {
      getCurrentPages()[0].backgroundAudioManager.title ='背景音乐'
      getCurrentPages()[0].backgroundAudioManager.play()
    }
    this.setData({
      amountList: [],
      page: 1
    })
    this.fetchAllowAmount()
    this.fetchList()

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