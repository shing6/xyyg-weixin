
const app = getApp()
Page({
  data: {
    orderList: [],
    showType: 0,
    imageUrl: app.globalData.URL,
    pageSize: 10,
    pageNum: 0,
    hasMore: true,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
   
  },

  onPullDownRefresh() {
    // wx.showNavigationBarLoading() //在标题栏中显示加载
   
    // wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {


    this.getOrderList();

  },

  getOrderList() {
    if (!this.data.hasMore) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      wx.hideLoading()
    }, 2000);

    let that = this;
    wx.request({
      url: app.globalData.URL + '/order/getAllOrderList',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id'),
        pageNum : that.data.pageNum,
        pageSize: that.data.pageSize,
        showType:that.data.showType
      },
      success:function(res){
       
          
        var newList = that.data.orderList.concat(res.data);
        var count = parseInt(res.header['X-Total-Count']);
        var flag = that.data.pageNum * that.data.pageSize < count;
        that.setData({
          orderList: newList,
          hasMore: flag,
        });
        wx.hideLoading();
         if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
        
     }
  })
    that.data.pageNum++;
  },
  switchTab: function(event) {
    let showType = event.currentTarget.dataset.index;
    
    this.setData({
      showType: showType,
      orderList: [],
      pageSize: 10,
      pageNum: 0,
      hasMore:true,
    });
    this.getOrderList();
    
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getOrderList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})