import {
  GET,POST
} from '../../utils/request';

import {
  Daily
} from '../../utils/daily';
import {
  clickMusic
} from '../../utils/music.js'
import {
  SHARE_IMAGE_URL,
  SHARE_TITLE,
  SHARE_TO_FRIENDS_IMAGE_URL
} from '../../utils/constant';
import {
  parseSceneParam
} from '../../utils/util';
const App = getApp()
Page({

  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 1000,
    showTest:false,
    bgm: 'https://img.jammyfm.com/media/image/songquiz_assets/idol-bgm.mp3',
  },
  onLoad: function(options) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
      success:function(){
    // 开启审核版本遮罩
        _this.showTestMask()
      }
    })

    console.log("options", options);
    // 获取好友信息
    let { scene } = options;
    if (scene != undefined) {
      if (App.loginUtil.isLogin()) {
        scene = decodeURIComponent(scene);
      } else {
        scene = decodeURIComponent(decodeURIComponent(scene));
      }
      scene = decodeURIComponent(scene);
      let param = parseSceneParam(scene);
      // 获取好友关系
      this.getRefData(param.uid);
    }

    this.distributionEntry();
    this.fetchGoodsInfo();
    this.fetchBannerInfo();
    this.fetchSignInfo();

   

  },
  onShow: function() {
    if (App.loginUtil.isLogin()) {
      let signIn = () => {
        return new Promise(resolve => {
          resolve();
          this.setData({
            isShowSign: true,
            idolBtnClose: true
          })
        })
      }
      this.initMusic()
      Daily('daily_sign_log', signIn);
    }
    this.fetchUserInfo();
  },
 // 开启审核版本遮罩
 showTestMask(){

   GET('app/config').then(res=>{
     console.log("审核版本",res)
     let {env} = res;
    //  上传审核
    if(env=="audit"){
      this.setData({
        showTest:true
      })
    }
    if(env=="prod"){
      this.setData({
        showTest: false
      })
    }
   })
 },
// 开启分销入口
 distributionEntry(){
   GET('commission/config').then(res => {
     console.log("res", res)
     let { status = "" } = res;
     if (status == 1) {
       this.setData({
         isShowEntry: true
       })
     } else {
       this.setData({
         isShowEntry: false
       })
     }
   })
 },
  // 获取好友数据
  getRefData(refUserKey) {
    if (App.loginUtil.isLogin()){
      POST('user/relation/bind', {
        "refUserKey": refUserKey
      }).then(res => {
        console.log("res", res)
      })
    }
  
  },
  bindTop: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  //查询banner数据
  fetchBannerInfo: function() {
    GET('banner/config').then(res => {
      this.setData({
        imgUrls: res
      })
    });
  },
  //查询商品数据
  fetchGoodsInfo: function() {
    GET('goods/list').then(res => {
      this.setData({
        goodList: res
      })
    }).finally(() => {
      wx.hideLoading()
    });
  },
  //查询客服信息数据
  fetchServiceInfo: function() {
    GET('contact/tips').then(res => {
      this.setData({
        serviceList: res.tips
      })
    });
  },
  //获取用户数据
  fetchUserInfo: function() {
    GET('user/info').then(res => {
      this.setData({
        userInfo: res
      })
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
          isShowModal: true,
          isShowSign: false,
          idolBtnClose: false
        })
        this.fetchUserInfo();
        setTimeout(() => {
          this.setData({
            isShowModalSign: false,
            isShowModal: false
          })
        }, 2000)
      }
    });
  },
  //前往开始游戏界面
  goPlay: function(options) {
    let {
      id,
      num
    } = options.currentTarget.dataset
    let currentIndex = options.currentTarget.dataset.currentindex
    wx.reportAnalytics('index_goods_click_stat', {
      goods_id: id,
    })
    wx.reportAnalytics('index_click_stat', {
      location: `g_${currentIndex}`,
    })
    this.backgroundAudioManager.stop();

    // 判断微信审核版本还是正式版本

    if (this.data.showTest){
      wx.navigateTo({
        url: '/pages/goodsInfo/goodsInfo',
      })
      // 审核版本
    }else{
      // 正式版本
      wx.navigateTo({
        url: `/pages/start-game/start-game?proid=${id}&coinNum=${num}`,
      })
    }


  },
  //头像点击事件
  avatarAnalytics: function() {
    wx.reportAnalytics('index_click_stat', {
      location: `avatar`,
    })
  },
  //banner点击事件
  swiperChange: function(options) {
    let type = options.currentTarget.dataset.type
    let url = options.currentTarget.dataset.url
    let currentIndex = options.currentTarget.dataset.currentindex
    console.log(options)
    wx.reportAnalytics('index_click_stat', {
      location: `banner_${currentIndex}`
    })
    if (type == 'self') return wx.navigateTo({
      url: url
    })
    if (type == 'h5') {
      // this.audioContext.pause()
      wx.navigateTo({
        url: `/pages/game/game?currentUrl=${url}`
      })
    }
  },
  //跳转
  navigateToNext: function(param) {
    let url = param.currentTarget.dataset.url
    //礼品盒
    if (url == '/pages/gift-box/gift-box') {
      wx.reportAnalytics('index_click_stat', {
        location: `icon_giftbox`,
      })
    }
    //福利中心
    if (url == '/pages/welfare-center/welfare-center') {
      wx.reportAnalytics('index_click_stat', {
        location: `icon_welfare`,
      })
    }
    wx.navigateTo({
      url
    })
  },
  //立即咨询
  serviceNow: function() {
    wx.reportAnalytics('index_click_stat', {
      location: `consult_now`,
    })
  },
  //隐藏弹窗
  hideModal: function() {
    this.setData({
      isShowModal: false,
      checkService: false,
      isShowSign: false,
      idolBtnClose: false,
      isShowModalSign: false
    })
  },
  //显示弹窗
  showSignIn: function() {
    this.setData({
      isShowSign: true
    })
  },
  //点击客服弹窗
  checkModalService: function() {
    wx.reportAnalytics('index_click_stat', {
      location: `icon_service`,
    })
    this.fetchServiceInfo()
    this.setData({
      isShowModal: true,
      checkService: true,
      idolBtnClose: true
    })
  },
  // 背景音乐初始化
  initMusic: function() {
    let bg_audio = 'https://img.jammyfm.com/media/image/songquiz_assets/mxtkgo/bg_audio.mp3'
    //当前界面是否有实例backgroundAudioManager
    if (getCurrentPages()[0].backgroundAudioManager) {
      //当前界面的bgm是开始页面的bgm 需要重新播放音乐
      if (!getCurrentPages()[0].backgroundAudioManager || getCurrentPages()[0].backgroundAudioManager.src == bg_audio) {
        this.playBackgroundMusic()
      }
    }
    //当前界面未实例播放组件
    if (!getCurrentPages()[0].backgroundAudioManager) {
      this.playBackgroundMusic()
    }
  },
  //播放音乐
  playBackgroundMusic: function() {
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    let bgm = this.data.bgm
    this.backgroundAudioManager.title = '背景音乐'
    this.backgroundAudioManager.src = bgm
    //因backgroundAudioManager组件没有循环播放api，故监听播放结束动作
    this.backgroundAudioManager.onEnded((res) => {
      this.backgroundAudioManager.title = '背景音乐'
      this.backgroundAudioManager.src = bgm
    })
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