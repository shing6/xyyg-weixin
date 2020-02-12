// pages/carts/carts.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],               // 购物车列表
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,   // 全选状态，默认全选
    shopList: [],
    imageUrl: app.globalData.URL,
    },
  _storageKeyName:'cart',
  _storageKeyShopName: 'shop',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      cartTotalCounts: this.getCartTotalCounts(true),
      // shopList: shopData
    })
    
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
    // 如果登录了页面显示
    
      this.getShopByIds(this.shopCallBack);
      this.getGoodsByIds(this.goodsCallBack);
      var cartData = this.getCartDataFromLocal();
      var shopData = this.getShopDataFromLocal();
      if (cartData.length) {

        this.setData({
          // shopList: [],
          hasList: true,
          carts: cartData,
          shopList: shopData
        });


      }
      else {
        this.setData({
          hasList: false,
          shopList: [],
        })
      }
      this.firstSelected();
      this.getTotalPrice();
    
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
  * 当前店铺选中事件
  */
  selectShopList(e){
    const shopIndex = e.currentTarget.dataset.shopindex;
    const id=e.currentTarget.dataset.id;
    let shopList = this.data.shopList;
    let selectAllStatus = this.data.selectAllStatus;
    let cartTotalCounts = 0;
    let _cart = wx.getStorageSync(this._storageKeyName);
    const shopSelected = shopList[shopIndex].selected;
    shopList[shopIndex].selected = !shopSelected;
    let carts = this.data.carts;
    //遍历循环购物车商品，如果店铺选中,则该商铺商品全选
    for(let i=0;i<carts.length;i++){
      
      if (id == carts[i].sellerId) {
        const selected = carts[i].selected;
        carts[i].selected = shopList[shopIndex].selected;
        //修改缓存中商品的选中状态
        
        _cart[i].selected = carts[i].selected;
        wx.setStorageSync('cart', _cart);
      }
    }
    for(let i=0;i<shopList.length;i++){
      if (shopList[i].id != id){
        for (let j = 0; j < carts.length; j++){
          if (carts[j].sellerId == shopList[i].id){
            if (carts[j].selected){
                 cartTotalCounts += carts[j].counts;
                 
                }
            }
          }

         }
    }
    //算数量，如果为该商铺全选
    if (shopList[shopIndex].selected) {
      //循环把该商铺所有商品的数量加起来      
      for (let i = 0; i < carts.length; i++) {
        if (shopList[shopIndex].id == carts[i].sellerId) {
          if (carts[i].selected){
            cartTotalCounts += carts[i].counts;
            
          }
          
        }
      }
    }
    else {
      cartTotalCounts = cartTotalCounts;
    }
   //遍历循环商铺状态，进行导航栏的全选反选
    for (let i = 0; i < shopList.length;i++){
      var flag = true;
     if (!shopList[i].selected) {
        flag = false;
        break;
      }
    
    }
    selectAllStatus=flag;
   
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts,
      shopList: shopList,
      cartTotalCounts:cartTotalCounts
    });
    
    this.getTotalPrice();
  },
 
 
 
  /**
  * 当前商品选中事件
  */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let selectAllStatus =this.data.selectAllStatus;
    let shopList = this.data.shopList;
    let cartTotalCounts = this.data.cartTotalCounts;
    let _cart = wx.getStorageSync(this._storageKeyName);
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    //如果有商品未选中则全选取消,商铺全选也取消
    if (!carts[index].selected) {
      selectAllStatus=false;
      for (let i = 0; i < shopList.length; i++) {
      if (carts[index].sellerId == shopList[i].id){
          shopList[i].selected=false;
      }
      }

    }
    //如果某店铺商品全选则该商铺选上
    
        for (let j = 0; j < shopList.length; j++) {
          if (carts[index].sellerId == shopList[j].id) {
            for (let k = 0; k < carts.length; k++){
              if (carts[k].sellerId == carts[index].sellerId){
                if (!carts[k].selected){
                      shopList[j].selected=false;
                      break;
                   }
                else {//否则全选框被选中
                  shopList[j].selected = true;
                }
              }
            }
            
          }
        }
         
       
    // 如果所有商品全选则导航栏全选选上
    for (let i = 0; i < carts.length; i++) {//遍历所有单选框
      if (!carts[i].selected) {//如果有一个单选框没有选中则全选框不被选中
        selectAllStatus = false;
        break;
      } else {//否则全选框被选中
        selectAllStatus = true;
      }
    };
    //算单商品数量,如果选中则加上
    if (carts[index].selected) {
      cartTotalCounts = cartTotalCounts + carts[index].counts;
    }
    else{//否则减去
      cartTotalCounts = cartTotalCounts - carts[index].counts;
    }
    this.setData({
      carts: carts,
      selectAllStatus: selectAllStatus,
      shopList:shopList,
      cartTotalCounts: cartTotalCounts
    });
    //修改缓存中商品的选中状态
    _cart[index].selected = carts[index].selected;
    wx.setStorageSync('cart', _cart);
    this.getTotalPrice();
  },
 
 
  /**
  * 刚进入页面时判断选择状态
  */
  firstSelected(){
    let shopList = this.data.shopList;
    let selectAllStatus = this.data.selectAllStatus;
  
    let carts = this.data.carts;
    //如果有商品未选中则全选取消,商铺全选也取消
    for (let i = 0; i < carts.length; i++) {
    if (!carts[i].selected) {
      selectAllStatus = false;
      for (let k = 0; k < shopList.length; k++) {
        if (carts[i].sellerId == shopList[k].id) {
          shopList[k].selected = false;
        }

      }
    }
  }
    // 如果所有商品全选则导航栏全选选上
    for (let i = 0; i < carts.length; i++) {//遍历所有单选框
      if (!carts[i].selected) {//如果有一个单选框没有选中则全选框不被选中
        selectAllStatus = false;
        break;
      } else {//否则全选框被选中
        selectAllStatus = true;
      }
    }

    
    this.setData({
      carts: carts,
      selectAllStatus: selectAllStatus,
      shopList: shopList,
    });
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let _cart = wx.getStorageSync(this._storageKeyName);
    let _shop = wx.getStorageSync(this._storageKeyShopName);
    let _newShop=[]
    //删除缓存中的商品
    _cart.splice(index, 1);
    wx.setStorageSync('cart', _cart);
    //循环查询商铺是否还有商品，没有则删除缓存商铺信息
    for (let i = 0; i < _shop.length;i++){
      for (let j = 0; j < _cart.length; j++){
        if (_shop[i].id == _cart[j].sellerId){
          _newShop.push(_shop[i]);
                break;
             }
       
        }
    }
    wx.setStorageSync('shop', _newShop);
    this.setData({
      carts: _cart,
      shopList: _newShop
    });
    if (!_cart.length) {
      this.setData({
        hasList: false,
        shopList: [],
      });
    } else {
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    let shopList = this.data.shopList;
    let cartTotalCounts = 0;
    let _cart = wx.getStorageSync(this._storageKeyName);
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
      //修改缓存中商品的选中状态
      _cart[i].selected = carts[i].selected;
      wx.setStorageSync('cart', _cart);
    }
    for (let i = 0; i < shopList.length; i++) {
      shopList[i].selected = selectAllStatus;
    }
    
    //如果为全选
    if (selectAllStatus){
      //循环把所有商品的数量加起来      
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].selected) {
          cartTotalCounts += carts[i].counts;
        }
      }
    }
    else{
      cartTotalCounts = 0;
    }
   
   this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts,
      shopList: shopList,
      cartTotalCounts: cartTotalCounts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let cartTotalCounts=this.data.cartTotalCounts;
    let counts = carts[index].counts;
    let _cart = wx.getStorageSync(this._storageKeyName);
    counts = counts + 1;
    if (carts[index].selected){
      cartTotalCounts = cartTotalCounts + 1;
    }
    carts[index].counts = counts;
    //修改缓存中商品的数量
    _cart[index].counts = counts;
    wx.setStorageSync('cart', _cart);
    this.setData({
      carts: carts,
      cartTotalCounts: cartTotalCounts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let cartTotalCounts = this.data.cartTotalCounts;
    let carts = this.data.carts;
    let _cart = wx.getStorageSync(this._storageKeyName);
    let counts = carts[index].counts;
    if (counts <= 1) {
      return false;
    }
    counts = counts - 1;
    if (carts[index].selected) {
      cartTotalCounts = cartTotalCounts - 1;
    }
    carts[index].counts = counts;
    //修改缓存中商品的数量
    _cart[index].counts = counts;
    wx.setStorageSync('cart', _cart);
    this.setData({
      carts: carts,
      cartTotalCounts: cartTotalCounts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {         // 循环列表得到每个数据
      if (carts[i].price>0){
        if (carts[i].selected) {                     // 判断选中才会计算价格
          total += carts[i].counts * carts[i].price;   // 所有价格加起来
        }
     }
     else{
        if (carts[i].selected) {                     // 判断选中才会计算价格
          total += carts[i].counts * carts[i].oldPrice;   // 所有价格加起来
        }
     }
      
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
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
        if (res[i].selected) {
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
          counts += data[i].counts;

        }
      }
      else {
        counts += data[i].counts;

      }
    }
    return counts;


  },
  /*
   *删除提示框
   */
  toDeleteTap(e){
    let index =e.currentTarget.dataset.index;
    var that=this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.deleteList(e);
          
        } else if (sm.cancel) {
          return;
        }
      }
    })
   
  },

  /**
   * 根据商店id查询商店信息
   */
  getShopByIds(callBack){
     let data = this.getShopDataFromLocal();
     let sellerIdList=[];
     if(data.length!=0){
       for (let i = 0; i < data.length; i++) {
         sellerIdList.push(data[i].id);

       }
     }
    
   
    if (sellerIdList.length!=0){
      wx.request({
        url: app.globalData.URL + '/shop/getShopByIds',
        method: 'POST',
        data: {
          ids: sellerIdList,
        },
        header: {

          "Content-Type": "application/x-www-form-urlencoded"

        },
        success: (res) => {
          callBack && callBack(res);

        }
      })
    }
   
  },

  /**
   * 查找商店信息回调函数
   */
  shopCallBack(res){
    let shopData = this.getShopDataFromLocal();
    
    for(let i=0;i<shopData.length;i++){
       for(let j=0; j<res.data.length;j++){
         if (shopData[i].id==res.data[j].id){
           shopData[i].name = res.data[j].name;
          
            }
            
       }
    }
    //根据数据库更新购物车信息
    wx.setStorageSync(this._storageKeyShopName, shopData);
 },
  /**
   * 数组去重
   */
  removeDuplicatedItem(arr) {
    var tmp = {},
    ret =[];

    for(let i = 0, j = arr.length; i<j; i++) {
  if (!tmp[arr[i]]) {
    tmp[arr[i]] = 1;
    ret.push(arr[i]);
  }
}

  return ret;
},
  /**
  * 根据商品id查询商品信息
  */
  getGoodsByIds(callBack) {
    let data = this.getCartDataFromLocal();
    let idList = [];
    if(data.length!=0){
      for (let i = 0; i < data.length; i++) {
        idList.push(data[i].id);

      }
    }
   
 if(idList.length!=0){
   wx.request({
     url: app.globalData.URL + '/goods/getGoodsByIds',
     method: 'POST',
     data: {
       ids: idList,
     },
     header: {

       "Content-Type": "application/x-www-form-urlencoded"

     },
     success: (res) => {
       callBack && callBack(res);

     }
   })
 }
   
  },
  /**
  * 查找商品信息回调函数
  */
  goodsCallBack(res) {
    let goodsData = this.getCartDataFromLocal();

    for (let i = 0; i < goodsData.length; i++) {
      for (let j = 0; j < res.data.length; j++) {
        if (goodsData[i].id == res.data[j].id) {
          goodsData[i].goodsName = res.data[j].goodsName;
          goodsData[i].price = res.data[j].price;
          goodsData[i].oldPrice = res.data[j].oldPrice;
          goodsData[i].mainPic = res.data[j].mainPic;

        }
      }
    }
    //根据数据库更新购物车信息
    wx.setStorageSync(this._storageKeyName, goodsData);
  },
  /*
   *去付款页面
   */
  
  toPayTap(){
    //如果已经登录则去付款页面否则去登录页面
    if (app.globalData.hasLogin) {
      this.getGoodsByIds(this.goodsCallBack);
      wx.navigateTo({
        url: '../pay/pay',
      })
    }
    else{
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },

  toShopTap(e){
    wx.navigateTo({
      url: '../shop/shop?id=' + e.currentTarget.dataset.sellerid,
    })
  }
})