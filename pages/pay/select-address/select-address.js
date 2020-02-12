//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList: []
  },

  

  addAddess: function () {
    wx.navigateTo({
      url: "/pages/profile/address-add/address-add"
    })
  },

  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/profile/address-add/address-add?address=" + JSON.stringify(e.currentTarget.dataset.address)
    })
  },

  onLoad: function () {
    this.initShippingAddress();
  },
  onShow: function () {
    
  },
 
 /**
  * 选择地址
 */
  selectTap(e){
       if(e.currentTarget.dataset.address){
         wx.redirectTo({
           url: '../pay?address=' + JSON.stringify(e.currentTarget.dataset.address)
         })
         
       }
  },
  /**
   * 获取收货地址
   */
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
        if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
        this.setData({
          addressList: res.data,
        })
      }
    })
  },

})
