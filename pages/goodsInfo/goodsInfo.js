// pages/goodsInfo/goodsInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: ["http://h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcimg/2018/11/13/33/49371871542088944383_720x909_70.jpg", "http://h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcimg/2018/11/13/65/540772131542088944429_720x909_70.jpg","http://h2.appsimg.com/a.appsimg.com/upload/merchandise/pdcimg/2018/11/13/6/111668051542088944446_720x909_70.jpg"]
  },
  // 立即购买
  buy(){
    wx.showLoading({
      title: '查询库存中...',
      icon:"none",
    });
    setTimeout(()=>{
      wx.hideLoading()
      wx.showToast({
        title: '哎呀，库存不足了，客官下次早点来吧~',
        icon:"none",
        duration:2500
      })
    },1500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})