
var app = getApp();
Page({
  data: {
    status: false,
  },
  onLoad: function(options) {
    console.log();
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
     status: options.status === '1' ? true : false
    })
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
 
})