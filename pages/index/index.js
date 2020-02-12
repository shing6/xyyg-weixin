var WxSearch = require('../../wxSearchView/wxSearchView.js');
//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    sliderList: [],
    bannerList:[],
    navList: [],
    pageSize: 5,
    pageNum: 0,
    hasMore:true,
    shopList: [],
    imageUrl: app.globalData.URL,
  },
  
  onLoad: function (options) {
     this.getShopWithGoods();
     this.getBanner();
   },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.setData({
      shopList: [],
      pageNum: 0,
      hasMore: true,
    });

    this.getShopWithGoods();
    wx.stopPullDownRefresh();
  },
  /**
   * 去商家页面
   */
  shopTap:function(e){
    
    wx.navigateTo({
      url: '../shop/shop?id=' + e.currentTarget.dataset.id,
    })
  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {


    this.getShopWithGoods();

  },


  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: 'search/search'
    })
  },
  /**
   * 分页获取商家信息
   */
  getShopWithGoods(){
    if (!this.data.hasMore) {
      return;
    }
    wx.request({
      url: app.globalData.URL+'/shop/getAllShopWithGoods?pageNum=' + this.data.pageNum + "&&pageSize=" + this.data.pageSize,
      
      success: (res) => {
        var newList = this.data.shopList.concat(res.data);
        var count = parseInt(res.header['X-Total-Count']);
        var flag = this.data.pageNum * this.data.pageSize < count;
        this.setData({
          shopList: newList,
          hasMore:flag,
        });
      }
      
    })
    this.data.pageNum++;
  },

  /**
   * 获取轮播图信息
   */
  getBanner() {
   
    wx.request({
      url: app.globalData.URL + '/banner/getBannerForwx' ,

      success: (res) => {
      
        this.setData({
          bannerList: res.data,
        });
      }

    })
 
  },
  toUrl(e){
   
    if (e.currentTarget.dataset.tourl){
       wx.navigateTo({
           url: e.currentTarget.dataset.tourl,
    })
    }
   
  },
  toHotProduct(){
    wx.navigateTo({
      url: '/pages/hot-products/hot-products',
    })
  }

 
})
