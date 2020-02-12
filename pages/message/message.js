var WxSearch = require('../../wxSearchView/wxSearchView.js');
var WxParse = require('../../wxParse/wxParse.js');
//var WxParse = require('../../wxParse/html2json.js');
const app = getApp();

// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    pageNum: 0,
    hasMore: true,
    workList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options && options.searchValue) {
      this.setData({
        searchValue: "搜索：" + options.searchValue
      });
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
    this.getWork();
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
    this.setData({
      workList: [],
      pageNum: 0,
      hasMore: true,
    });
      this.getWork();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   this.getWork();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  getWork(){
    if (!this.data.hasMore) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 2000);

    let that = this;
    wx.request({
      url: app.globalData.URL + '/work/getWorkForWx',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize,
        //showType: that.data.showType
      },
      success: function (res) {
        var newList = that.data.workList.concat(res.data);
        var count = parseInt(res.header['X-Total-Count']);
        var flag = that.data.pageNum * that.data.pageSize < count;
        let list = res.data;
        let newinfo=[];
        for (let i = 0; i < list.length; i++) {
           newinfo.push(list[i]['detail']);
        }
        for (let j = 0; j < newinfo.length; j++) {
          WxParse.wxParse('info' + j, 'html', newinfo[j], that);
          if (j === newinfo.length - 1) {
            var infolist = WxParse.wxParseTemArray("infolist", 'info', newinfo.length, that)
          }
        }
        
        that.setData({
          workList: newList,
          hasMore: flag,
          helpcenter:list,
         });
        
        wx.hideLoading();
       }
    })
    that.data.pageNum++;
  },
  
  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: 'search/search'
    })
  },
  toMessageTap(e){
    wx.navigateTo({
      url: '../message-item/message-item?id=' + e.currentTarget.dataset.id,
    })
  }

})
