//获取应用实例
const app = getApp();
Page({
  
  _storageKeyName:'cart',
  _storageKeyShopName: 'shop',
  _storageCollect: 'collect',
  /**
   * 页面的初始数据
   */
  data: {
    
    productCounts:1,
    product:{},
    currentTabsIndex:0,
    imageUrl: app.globalData.URL,
    goodsId:0,
    comment:[],
    isCollect:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsById(options.id);
    this.setData({
      cartTotalCounts: this.getCartTotalCounts(false),
      goodsId: options.id
    })
    this.getCommentById(options.id);
    this.getCollectData(options.id)
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
 
  //点击导航栏
  onTabsItemTap:function(event){
   this.setData({
       currentTabsIndex:event.currentTarget.dataset.index,
     })
  },
  //(
  toCartsTap:function(){
    wx.switchTab({
      url: '../carts/carts'
    })
   
  },

  /*
    * 获取购物车
    * param
    * flag - {bool} 是否过滤掉不下单的商品
    */
  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }
    //在下单的时候过滤不下单的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  },

  getShopDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyShopName);
    if (!res) {
      res = [];
    }
    //在下单的时候过滤不下单的商品，
    if (flag) {
      var newRes = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  },

  /*
    *获得购物车商品总数目,包括分类和不分类
    * param:
    * flag - {bool} 是否区分选中和不选中
    * return
    * 
    * 
    */
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal(),
        counts = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selected) {
          counts+= data[i].counts;
          
        }
      } 
      else {
        counts+= data[i].counts;
        
      }
    }
    return counts;
     
    
  },

  /**
   * 点击按钮加入到购物车
   */
  onAddingTocartTap: function (event){
    //防止快速点击
    if (this.data.isFly) {
      return;
    }
    this._flyToCartEffect(event);
    this.addToCart();

    wx.showToast({
      title: '添加成功~',
      icon: 'success',
      duration: 2000
    })
  },
  /**
   * 把商品加到内存
   */
  addToCart:function(){
    var tempObj = {}, keys = ['id', 'goodsName', 'mainPic', 'price', 'oldPrice','sellerId'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }

    this.add(tempObj, this.data.productCounts); 
    this.addShopToCart();
  },
/**
   * 把商家加到内存
   */
  addShopToCart: function () {
    var shopObj = {}, keys = ['id', 'name'];
    for (var key in this.data.shop) {
      if (keys.indexOf(key) >= 0) {
        shopObj[key] = this.data.shop[key];
      }
    }

    this.addShop(shopObj);
  },

  /*
   * 加入到购物车
   * 如果之前没有样的商品，则直接添加一条新的记录， 数量为 counts
   * 如果有，则只将相应数量 + counts
   * @params:
   * item - {obj} 商品对象,
   * counts - {int} 商品数目,
   * */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();
    if (!cartData) {
      cartData = [];
    }
    var isHadInfo = this._isHasThatOne(item.id, cartData);
    //新商品
    if (isHadInfo.index == -1) {
      item.counts = counts;
      item.selected = true;  //默认在购物车中为选中状态
      cartData.push(item);
    }
    //已有商品
    else {
      cartData[isHadInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName,cartData);  //更新本地缓存
    
  },

  /**
   * 同时加入商家信息
   */
  addShop(item){
    var shopData = this.getShopDataFromLocal();
    if (!shopData) {
      shopData = [];
    }
    var isHadInfo = this._isHasThatOne(item.id, shopData);
    //新商家
    if (isHadInfo.index == -1) {
      item.selected = true;  //默认在购物车中为选中状态
      shopData.push(item);
    }
    //已有商家
    else {
      
    }
    wx.setStorageSync(this._storageKeyShopName, shopData);  //更新本地缓存
 },
  /*购物车中是否已经存在该商品*/
  _isHasThatOne(id, arr) {
    var item,
      result = { index: -1 };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = {
          index: i,
          data: item
        };
        break;
      }
    }
    return result;
  },

  /** 
   * 加入购物车动效
  */
 _flyToCartEffect: function (event) {
    //获得当前点击的位置，距离可视区域左上角
    var touches = event.touches[0];
    var diff = {
      x: '25px',
      y: 25 - touches.clientY + 'px'
    },
      style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
    this.setData({
      isFly: true,
      translateStyle: style
    });
    var that = this;
    setTimeout(() => {
      that.setData({
        isFly: false,
        translateStyle: '-webkit-transform: none;',  //恢复到最初状态
        isShake: true,
      });
      setTimeout(() => {
        var counts = that.data.cartTotalCounts + that.data.productCounts;
        that.setData({
          isShake: false,
          cartTotalCounts: counts
        });
      }, 200);
    }, 1000);
  },

  /**
  * 根据商品id查询商品详细信息
  */
  getGoodsById(id) {
    
    wx.request({
      url: app.globalData.URL + '/goods/getGoodsById?id=' + id,

      success: (res) => {
       
        this.setData({
          product:res.data,
         
        });
        this.getShopById(res.data.sellerId);
      }

    })
    
  },
  /**
   * 根据商家id查询商家信息
   */
  getShopById(id){
    wx.request({
      url: app.globalData.URL + '/shop/getShopById?id=' + id,

      success: (res) => {

        this.setData({
          shop: res.data,

        });
      }

    })
  },

  /**
  * 根据商品id查询商品商品评论信息
  */
  getCommentById(id) {

    wx.request({
      url: app.globalData.URL + '/comment/getCommentById?goodsId=' + id,

      success: (res) => {
        
        this.setData({
          comment: res.data,

        });
       }

    })

  },
  /**
   * 去购物车页面
   */
  toCartsTap(){
    wx.switchTab({
      url: '../carts/carts',
    })
  },
  /**
   * 去评价页面
   */
  toCommentTap(){
    wx.navigateTo({
      url: '../comment-list/comment-list?id=' + this.data.goodsId
    })
  },
  /**
   * 收藏商品
   */
  collect(e){
    var tempObj = {}, keys = ['id', 'goodsName', 'mainPic', 'price', 'oldPrice', 'sellerId'];
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }

    this.addCollect(tempObj);
    this.getCollectData(e.currentTarget.dataset.id);
  },
  /**
   * 加入缓存
   */
  addCollect(item) {
    var collectData = wx.getStorageSync(this._storageCollect);
    if (!collectData) {
      collectData = [];
    }
    var isHadInfo = this._isHasThatOne(item.id, collectData);
    //新商品
    if (isHadInfo.index == -1) {
      collectData.push(item);
    }
    //已有商品则删除
    else {
       collectData.splice(isHadInfo.index,1);
    }
    wx.setStorageSync(this._storageCollect, collectData);  //更新本地缓存

  },
  /**
   * 获取收藏缓存商品,判断是否收藏
   */
  getCollectData(id){
   
    var collectData = wx.getStorageSync(this._storageCollect);
    if (collectData.length==0){
      this.setData({
        isCollect: false
      })
    }
    for (let i = 0; i < collectData.length;i++){
      if (collectData[i].id==id){
             this.setData({
               isCollect:true
             })
             return;
          }
      else {
        this.setData({
          isCollect: false
        })
        }
    }
  },

  /**
   * 去商家页面
   */
  shopTap: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../shop/shop?id=' + e.currentTarget.dataset.sellerid,
    })
  },


})