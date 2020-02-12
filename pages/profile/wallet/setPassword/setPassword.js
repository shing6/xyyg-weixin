// pages/shopmanage/shoppwd.js
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
  editpwd: function (e) {
    var that = this;
    var fdata = e.detail.value;
    if (fdata.opwd==""){
      wx.showModal({
        title: '提示',
        content: '请填写旧密码',
        showCancel: false
      })
      return  
    }
    if (fdata.pwd == "") {
      wx.showModal({
        title: '提示',
        content: '请填写新密码',
        showCancel: false
      })
      return  
    }
    if (fdata.repwd == "") {
      wx.showModal({
        title: '提示',
        content: '请填写确认密码',
        showCancel: false
      })
      return  
    }
    if (fdata.pwd == fdata.repwd) {
      wx.request({
        url: app.globalData.URL + '/wallet/updateWechatWalletPassword',
        method: 'post',
        data: {
          open_id: wx.getStorageSync('open_id'),
          pwdVal: fdata.pwd,
          oldPwd: fdata.opwd
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.errno==0){
            wx.showToast({
              title: '修改成功',
              duration: 3000
            });
          }
          else if (res.data.errno == 512) {
            wx.showToast({
              title: '旧密码不正确',
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
    } else {
      wx.showToast({
        title: '密码不一致!',
        icon:'none'
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