var user = require('../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },

  onLoad: function () {
    // 页面加载时使用用户授权逻辑，弹出确认的框  
   
  },
  wxLogin: function (e) {
   
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      wx.showToast({
        title: '微信登录失败',
        image: '/images/nav/icon_error.png'
      })
      return;
    }

    user.checkLogin().catch(() => {
      user.loginByWeixin(e.detail.userInfo).then(res => {
        
        app.globalData.hasLogin = true;
        wx.navigateBack({
          delta: 1
        })
       
      }).catch((err) => {
        app.globalData.hasLogin = false;
        wx.showToast({
          title: '微信登录失败',
          image: '/images/nav/icon_error.png'
        })
      });

    });
  }
})
