import {
  GET,
  POST
} from '../../utils/request';
import {
  parseSceneParam
} from '../../utils/util';
import {
  SHARE_IMAGE_URL,
  SHARE_TITLE,
  SHARE_TO_FRIENDS_IMAGE_URL
} from '../../utils/constant';

import {
  apiDomain
} from '../../utils/config'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPosterModal:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options", options);
    // 获取好友信息
    let {
      scene
    } = options;
    if (scene != undefined) {
      if (App.loginUtil.isLogin()) {
        scene = decodeURIComponent(scene);
      } else {
        scene = decodeURIComponent(decodeURIComponent(scene));
      }
      scene = decodeURIComponent(scene);
      let param = parseSceneParam(scene);
      refUserKey = param.uid;
      // 获取好友关系
      this.getRefData(refUserKey);
    }

  },
  // 拉取数据
  fetchData() {
    wx.showLoading({
      title: '加载中...',
    })
    // 用户获取奖励的总数
    GET('share/get_user_prize').then(res => {
      let {
        prize = 0
      } = res;
      this.setData({
        totalPrice: prize
      })
    })
    // 轮播提示信息
    GET('share/get_system_notice').then(res => {
      this.setData({
        carouselData: res
      })
    })
    //分销人数关系
    GET('share/get_friends_num').then(res => {
      
      let {
        direct,
        indirect
      } = res;
      this.setData({
        direct,
        indirect
      })
    })

  },
  // 获取好友数据
  getRefData(refUserKey) {
    POST('user/relation/bind', {
      "refUserKey": refUserKey
    }).then(res => {
      console.log("res", res)
    })
  },
  // 创建海报
  createPoster() {
    wx.showLoading({
      title: '生成海报中...',
      icon: "none"
    })


    let imgUrl = `${apiDomain}/api/sk/user/personal/qr-img?token=${App.loginUtil.getToken()}`;
    this.setData({
      postImg: imgUrl,
      showPosterModal: true
    })
  },
  // 保存海报
  postSave(e) {
    wx.showLoading({
      title: '保存中...'
    })
    wx.downloadFile({
      url: this.data.postImg,
      success: function (res) {
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '您的推广海报已存入手机相册，赶快分享给好友吧',
              showCancel:false,
            })
          },
          fail: function (err) {
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success:modalSuccess=>{
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {

                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,

                        })
                        // console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,

                        })
                        // console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      }
                    },
                    fail(failData) {
                      console.log(failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
           
            }
          },
          complete(res) {
            wx.hideLoading()
            console.log(res);
          }
        })
      }
    })

  },
  // 取消保存
  postCancel(){
    this.setData({
      showPosterModal: false
    })

  },
  // 图片加载成功
  imgLoadOk(){
    wx.hideLoading();
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
    this.fetchData();
    wx.hideLoading();
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