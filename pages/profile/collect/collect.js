//获取应用实例
const app = getApp();
// pages/profile/collect/collect.js
Page({
  _storageCollect: 'collect',
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.URL,
    collectList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getCollectData();
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

  getCollectData() {

    var collectData = wx.getStorageSync(this._storageCollect);
     this.setData({
       collectList: collectData
     })
   
  },
  deleteTap(e){
    var id = e.currentTarget.dataset.id;
    var collectData = wx.getStorageSync(this._storageCollect);
    for (let i = 0; i < collectData.length; i++) {
      if (collectData[i].id == id) {
        collectData.splice(i, 1);
      }
    }
    wx.setStorageSync(this._storageCollect, collectData);  //更新本地缓存
    this.getCollectData();
  },
  //点击商品进入详情页
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: '/pages/products-item/products-item?id=' + e.currentTarget.dataset.id,
    })
  }
})