// pages/products/products.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '销量', '新品', '价格'],
    currentTab: 0,
    current: 0,
    searchValue:null,
    imageUrl: app.globalData.URL,
    pageSize:5,
    pageNum: 1,
    hasMore: true,
    // 切换
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0,
      ab: 0,
      agg: 0
    },
    p: 0,//销量
    t: 0,//折扣
    condition: "id",
    sort: "asc",

    productsArr:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.searchValue){
      console.log(options.searchValue);
      // this.getGoodsByName(options.searchValue, this.callBackByName);
      this.getGoodsByNameOrderBySort(options.searchValue, this.data.condition, this.data.sort, this.callBackBySort);
      this.setData({
        searchValue: options.searchValue,
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
    var that =this;
    that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 导航切换监听

  navbarTap: function(e) {
   
    this.setData({
    
      currentTab: e.currentTarget.dataset.idx

    })
    
  },
  onProductsItemTap:function(e){
      
    wx.navigateTo({
      url: '../products-item/products-item?id=' + e.currentTarget.dataset.id,
    })
  },

  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性
   
    var that = this;
    var _datasetId = e.target.dataset.id;
    var _datasetp = e.target.dataset.p;
    var _datasett = e.target.dataset.t;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    //  第一个没排序
    if (_datasetId == 0) {
      _obj.ab = 0;
      _obj.agg = 0;
      that.setData({
        condition: 'id',
        sort: 'desc',
        tabArr: _obj,
        p: 0,
        t: 0,
        productsArr:[],
        pageNum: 1,
        hasMore:true,
      });
      // that.getGoodsByName(that.data.searchValue, that.callBackByName);
      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
    }
    //  第二个根据销量排序
    if (_datasetId == 1 && _datasetp == 0) {
      _obj.agg = 0;
      _obj.ab = 4;
      that.setData({
        tabArr: _obj,
        p: 5,
        t: 0,
        condition: 'counts',
        sort: 'asc',
        productsArr: [],
        pageNum: 1,
        hasMore: true,
      });
      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
     
    }
    if (_datasetId == 1 && _datasetp == 5) {
      _obj.agg = 0;
      _obj.ab = 5;
      that.setData({
        tabArr: _obj,
        p: 0,
        condition: 'counts',
        sort: 'desc',
        productsArr: [],
        pageNum: 1,
        hasMore: true,
       
      });
      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
    }
    //  第三个根据价格排序
    if (_datasetId == 2 && _datasett == 0) {
     
      _obj.ab = 0;
      _obj.agg = 4;
      that.setData({
        tabArr: _obj,
        t: 5,
        condition: 'price',
        sort: 'asc',
        productsArr:[],
        pageNum:1,
        hasMore: true,
      });
     

      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
    }
    if (_datasetId == 2 && _datasett == 5) {
      _obj.ab = 0;
      _obj.agg = 5;
      that.setData({
        tabArr: _obj,
        t: 0,
        condition: 'price',
        sort: 'desc',
        productsArr: [],
        pageNum: 1,
        hasMore:true,
      });
     
      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
    }
    //  第4个按上架时间降序
    if (_datasetId == 3) {
      _obj.ab = 0;
      _obj.agg = 0;
      that.setData({
        tabArr: _obj,
        p: 0,
        t: 0,
        condition: 'createTime',
        sort: 'desc'
      });
      that.getGoodsByNameOrderBySort(that.data.searchValue, that.data.condition, that.data.sort, that.callBackBySort);
    }
  
    
  },
  

  searchBox: function (e) {
   
    if(e.detail.value){
      this.setData({
        searchValue: e.detail.value
      });
      this.getGoodsByName(this.data.searchValue, this.callBackByName);
      this.tabFun(e);
    }
  },
  /**
   * 根据商品名字模糊查询商品信息
   */
  getGoodsByName(name,callBack) {
    wx.request({
      url: app.globalData.URL + '/goods/getGoodsByName',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        name : name,
      },
      method: 'POST',
      success: (res) => {

        callBack&&callBack(res)
      }

    })
  },

/**
 * 根据姓名模糊查询回调函数
 */
  
  callBackByName(res){
    
        this.setData({
          productsArr: res.data,
        }) 
  },
  /**
 * 根据姓名模糊查询排序回调函数
 */

  callBackBySort(res) {
    var newList = this.data.productsArr.concat(res.data);
    var count = parseInt(res.header['X-Total-Count']);
    var flag = this.data.pageNum * this.data.pageSize < count;
    
    this.setData({
      productsArr: newList,
      hasMore: flag,
    });
   
    this.data.pageNum++;
  },
 

  /**
  * 根据商品名字模糊查询商品信息
  */
  getGoodsByNameOrderBySort(name,condition,sort,callBack) {

    if (!this.data.hasMore) {
      return;
    }
    
    wx.request({
      // url: app.globalData.URL + '/goods/getGoodsByNameOrderBySort?name=' + name + '&&condition=' + condition + '&&sort=' + sort + '&&pageNum='+ this.data.pageNum + '&&pageSize=' + this.data.pageSize,
      url: app.globalData.URL + '/goods/getGoodsByNameOrderBySort',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: name,
        condition: condition,
        sort: sort,
        pageNum: this.data.pageNum,
        pageSize:this.data.pageSize,
      },
      success: (res) => {

        callBack && callBack(res)
      }

    })
    
  },

 
})