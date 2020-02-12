// pages/hot-products/hot-products.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productsArr: [],
    imageUrl: app.globalData.URL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotProduct()
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

  /**
   * 获取热门商品信息
   */
  getHotProduct() {

    wx.request({
      url: app.globalData.URL + '/goods/selectHotGoods',

      success: (res) => {

        this.setData({
          productsArr: res.data,
        });
      }

    })

  },
  onProductsItemTap: function (e) {

    wx.navigateTo({
      url: '../products-item/products-item?id=' + e.currentTarget.dataset.id,
    })
  },
})