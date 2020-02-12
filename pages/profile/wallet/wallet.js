
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     wallet:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWallet();
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

  },
  getWallet(){
    let that =this;
    wx.request({
      url: app.globalData.URL + '/wallet/getWechatMoney',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id'),
       },
      success: function (res) {
        if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
        else {
          that.setData({
            wallet:res.data
          });

        

        }

      }
    })

  },
  toSetPassword(){
    wx.navigateTo({
      url:"setPassword/setPassword"
    })
  },
  toRecharge(){
    wx.navigateTo({
      url: "rechange/rechange"
    })
  }
  
})