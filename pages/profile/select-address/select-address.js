//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList: []
  },

  

  addAddess: function () {
    wx.navigateTo({
      url: "../address-add/address-add"
    })
  },

  editAddess: function (e) {
    wx.navigateTo({
      url: "../address-add/address-add?address=" + JSON.stringify(e.currentTarget.dataset.address) 
    })
  },

  onLoad: function () {
  },
  onShow: function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/address/getAddressById',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id')
      },
      success: (res) => {
       if(res.data.errno == 501) {
       wx.showToast({
        title: '请先登录',
        image: '/images/nav/icon_error.png'
      })
         wx.redirectTo({
           url: "/pages/login/login"
         });
     }
      this.setData({
        addressList:res.data,
      })
      }
    })
  },

 

})
