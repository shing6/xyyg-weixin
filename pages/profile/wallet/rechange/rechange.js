// pages/profile/wallet/rechange/rechange.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  editpwd: function (e) {
    var that = this;
    var fdata = e.detail.value;
    if (fdata.no == "") {
      wx.showModal({
        title: '提示',
        content: '请填写充值卡号',
        showCancel: false
      })
      return
    }

        wx.request({
          url: app.globalData.URL + '/wallet/rechange',
        method: 'post',
        data: {
          open_id: wx.getStorageSync('open_id'),
          no: fdata.no,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.errno == 0) {
            wx.showToast({
              title: '充值成功',
              duration: 3000
            });
          }
          else if (res.data.errno == 513) {
            wx.showToast({
              title: '卡号已使用',
              icon: 'none',
              duration: 3000,

            });
          }
          else if (res.data.errno == 514) {
            wx.showToast({
              title: '卡号错误',
              icon: 'none',
              duration: 3000,

            });
          }
          else{
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              duration: 3000,

            });
          }

        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            icon: 'none',
            duration: 3000,

          });
        }
      })
   
  },
})