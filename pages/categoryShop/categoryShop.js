const app = getApp();
Page({
  data: {
    curNav: 1,
    curIndex: 0,
    scrollTop: 0,
    imageUrl: app.globalData.URL,
  },
   onLoad(){
     this.getCategory();
   },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
    this.getShopBySellerId(id);
  },

  getCategory(){
    wx.request({
      url: app.globalData.URL + '/category/getShopCategory',
      success: (res) => {
        let categoryId = res.data[0].id;
        this.getShopBySellerId(categoryId);
        
        this.setData({
          cateItems: res.data,
        });
      }
    })

  },
  getShopBySellerId(id){
    wx.request({
      url: app.globalData.URL + '/shop/getShopByCategoryId?sellerCategoryId=' + id,
      success: (res) => {
        
        this.setData({
          shopItems: res.data,
          curNav: id,
        });
        //console.log(res.data);
      }
    })
  },
  /**
  * 去商家页面
  */
  shopTap: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../shop/shop?id=' + e.currentTarget.dataset.id,
    })
  },
}) 