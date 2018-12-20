import {
  GET,
  POST
} from '../../utils/request';

import {
  SHARE_IMAGE_URL,
  SHARE_TITLE,
  SHARE_TO_FRIENDS_IMAGE_URL
} from '../../utils/constant';
// webview 加载url
let webviewurl;
let normalBack=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLink: '',
    
  },
  // 网页回调信息
  webMsg(e) {
    console.log('网页回调信息',e)
    // 游戏类型
    let gameMode = e.detail.data[0].gameMode;
    // 游戏结果 0：失败 1：胜利
    let result = e.detail.data[0].result;
    // 试玩模式
    if (gameMode == "try") {
      // 游戏失败
      if (result == 0) {
        let postData = {
          result,
          goodsId: this.data.goodsId,
          levelResult1: e.detail.data[0].levelResult1,
          levelResult2: e.detail.data[0].levelResult2,
          levelResult3: e.detail.data[0].levelResult3,
          time1: e.detail.data[0].time1 || null,
          time2: e.detail.data[0].time2 || null,
          time3: e.detail.data[0].time3 || null,
        }
        POST('game/practice/report', postData).then(res => {
        })
      }
      if (result == 1) {
        let postData = {
          result,
          goodsId: this.data.goodsId,
          levelResult1: e.detail.data[0].levelResult1,
          levelResult2: e.detail.data[0].levelResult2,
          levelResult3: e.detail.data[0].levelResult3,
          time1: e.detail.data[0].time1 || null,
          time2: e.detail.data[0].time2 || null,
          time3: e.detail.data[0].time3 || null,
        }
        POST('game/practice/report', postData).then(res => {
        })
      }
   
    }


    // 正式模式
    if (gameMode == "official") {

      // 游戏失败
      if (result == 0) {
        let postData = {
          goodsId: this.data.goodsId,
          gameId: this.data.gameId,
          gameInfo: {
            result,
            levelResult1: e.detail.data[0].levelResult1,
            levelResult2: e.detail.data[0].levelResult2,
            levelResult3: e.detail.data[0].levelResult3,
            time1: e.detail.data[0].time1 || null,
            time2: e.detail.data[0].time2 || null,
            time3: e.detail.data[0].time3 || null,
          }
        }
        POST('user/reward', postData).then(res => {
        })
      }
      if (result == 1) {
        // 游戏页面跳转页面类型 1： 回到礼品盒 2：首页
        let backtype;
        if (e.detail.data[1]) {
          backtype = e.detail.data[1].backurl
        } else {
          backtype = 2;
        }
        let postData = {
          goodsId: this.data.goodsId,
          gameId: this.data.gameId,
          gameInfo: {
            result,
            levelResult1: e.detail.data[0].levelResult1,
            levelResult2: e.detail.data[0].levelResult2,
            levelResult3: e.detail.data[0].levelResult3,
            time1: e.detail.data[0].time1 || null,
            time2: e.detail.data[0].time2 || null,
            time3: e.detail.data[0].time3 || null,
          }
        }
        POST('user/reward', postData).then(res => {
          if (backtype == 1) {
            wx.redirectTo({
              url: '/pages/gift-box/gift-box',
            })
          }
          if (backtype == 2) {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        })

      }
    }
   
    normalBack =true;
  },
  // 网页加载成功
  loadOk(e) {
    console.log(2131333333333333333333333)
    // 网页加载成功 扣除金币
    // if (this.data.gamemode==0){
    //   console.log(21312312312)
    //   GET('user/cost-coin', { id: this.data.goodsId }).then(res => {
    //     let gameId = res.gameId;
    //     this.setData({
    //       gameId
    //     })
    //   })
    // }
  },
  // 网页加载失败
  loadFail(e) {
    wx.showToast({
      title: '加载失败...',
      success: () => {
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getCurrentPages()[0].backgroundAudioManager.stop()
    console.log(options)
    console.log(decodeURIComponent(options.currentUrl))
    if (options.currentUrl) {
      webviewurl = options.currentUrl;
      this.setData({
        goodsId: options.goodsId || "",
        gamemode: options.gamemode,
        gameId:options.gameId,
        showLink: decodeURIComponent(options.currentUrl)
      })
    }
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
    // 直接返回游戏
    console.log("返回游戏")
  // 非正常退出
  // if(!normalBack){
  //   // 存在gameID 表明 付费模式
  //   if(this.data.gamemode==0){
  //     let postData = {
  //       goodsId: this.data.goodsId,
  //       gameId: this.data.gameId,
  //       gameInfo: {
  //         result: 0,
  //         levelResult1: null,
  //         levelResult2: null,
  //         levelResult3: null,
  //         time1: null,
  //         time2: null,
  //         time3: null,
  //       }
  //     }
  //     POST('user/reward', postData).then(res => {
  //     })
  //   }else{
  //     let postData = {
  //       result:0,
  //       goodsId: this.data.goodsId,
  //       levelResult1: null,
  //       levelResult2: null,
  //       levelResult3: null,
  //       time1: null,
  //       time2: null,
  //       time3: null,
  //     }
  //     POST('game/practice/report', postData).then(res => {
  //     })
  //   }


   
  // }
    getCurrentPages()[0].backgroundAudioManager.play()
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