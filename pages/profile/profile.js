// pages/user/index.js
const app = getApp()
var user = require('../../utils/user.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aboutShow: true,
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    }
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
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        aboutShow: true,
        userInfo: userInfo,
      });
    }
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
   * 进入登录界面
   */
  goLogin() {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
   /**
   * 进入订单界面
   */
  goOrder() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },
  goCoupon() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/coupon/coupon"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };

  },
  /**
   * 进入钱包界面
   */
  goWallet() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "wallet/wallet"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  },
  goCollect() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/profile/collect/collect"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  },
  goFootprint() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  },
  /**
   * 进入收货地址页面
   */
  goAddress() {
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "select-address/select-address"
      });
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }

 
})