// pages/contact/contact.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
          classifyViewed:0,
          scrollTop: 0,
          newList:[],
          shop:null,
          categoryName:"",
          hasMore:null,
          goodsList:[],
          goodsListCurrent:[],
          categories:[],
          imageUrl: app.globalData.URL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getShopById(options.id);
    this.getShopCategoryById(options.id);
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
   * 自定义函数点击分类
   */
  tapClassify: function (e) {
    
   
    let id = e.target.dataset.id;
    let name=e._relatedInfo.anchorRelatedText;
   
    this.getGoodsByCategoryId(id)
    if (id === this.data.classifyViewed) {
      
      this.setData({
        scrolltop: 0,
       
      })
    } else {
      this.setData({
        classifyViewed: id,
        categoryName: name,
        });

     
     
      
    }
  },
  /**
   * 根据id获取商家信息
   */
getShopById(id){
  
     wx.request({
       url: app.globalData.URL + '/shop/getShopById?id=' + id,
       success: (res) => {
        
         this.setData({
           shop:res.data,
          
         });
       }
     })
  },

  /**
  * 根据商家id获取分类
  */
  getShopCategoryById(id) {

    wx.request({
      url: app.globalData.URL + '/category/getShopCategoryById?id=' + id,
      success: (res) => {
        let categoryId = res.data[0].id;
        this.getGoodsByCategoryId(categoryId);
        if (res.data[0].categoryName){
          var names = res.data[0].categoryName
        }
        this.setData({
          categories: res.data,
          classifyViewed: categoryId,
          categoryName:names
        });
      }
    })
   
  },
  /**
   * 根据分类id获取商品
   */
  getGoodsByCategoryId(id){
    wx.request({
      url: app.globalData.URL + '/goods/getGoodsByCategoryId?categoryId=' + id,
      success: (res) => {
      
        this.setData({
          goodsList: res.data,
          scrolltop: 0,
        });
      }
    })
  },
 //点击商品进入详情页
  toDetailsTap:function(e){
  wx.navigateTo({
    url: '../products-item/products-item?id=' + e.currentTarget.dataset.id,
  })
}

  
})