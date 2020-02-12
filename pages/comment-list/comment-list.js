var app = getApp();


Page({
  data: {
    allCommentList: [],
    type: 0,
    showType: 0,
    allCount: 0,
    pageNum:0,
    pageSize:3,
    imageUrl: app.globalData.URL,
    hasMore: true,
    goodsId:0,
  },
  getCommentCount: function() {
    let that = this;
    
  },
  getCommentList: function (callBack) {
    
    let that = this;
    if (!that.data.hasMore) {
      return;
    }
    
    wx.request({
      url: app.globalData.URL + '/comment/getCommentWithPictureById?goodsId=' + that.data.goodsId + "&&pageNum=" + that.data.pageNum + "&&pageSize=" + that.data.pageSize + "&&showType=" + that.data.showType,
     
      success: (res) => {

        callBack&&callBack(res)
        var newList = that.data.allCommentList.concat(res.data);
        var count = parseInt(res.header['X-Total-Count']);
        var goodCount = parseInt(res.header['X-Good-Count']);
        var middleCount = parseInt(res.header['X-Middle-Count']);
        var badCount = parseInt(res.header['X-Bad-Count']);
        var allCount = parseInt(res.header['X-All-Count']);
        if (that.data.showType==0){
          var flag = that.data.pageNum * that.data.pageSize < allCount;
        }
        else if (that.data.showType == 1){
          var flag = that.data.pageNum * that.data.pageSize < goodCount;
        }
        else if (that.data.showType == 2) {
          var flag = that.data.pageNum * that.data.pageSize < middleCount;
        }
        else if (that.data.showType == 3) {
          var flag = that.data.pageNum * that.data.pageSize < badCount;
        }
        let arrPic = res.data;
        let picArr=[]
        for(let i=0;i<arrPic.length;i++){
          for (let j = 0; j < arrPic[i].commentPictureList.length;j++){
            picArr.push(that.data.imageUrl+arrPic[i].commentPictureList[j].picAddr); 
          }
         }
       
        that.setData({
          allCommentList: newList,
          picArr: picArr,
          hasMore:flag,
          count: count,
          goodCount: goodCount,
          middleCount: middleCount,
          badCount: badCount,
          allCount: allCount
        });
        
      }

    })
    that.data.pageNum++;
  },
  callBack(res){
    
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
       goodsId: options.id,
      
     });
  
    
    this.getCommentList();
  },
  onReady: function() {
    // 页面渲染完成
    
  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  },
  switchTab: function (event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      showType: showType,
      allCommentList: [],
      pageSize: 3,
      pageNum: 0,
      hasMore: true,
    });
     this.getCommentList();

  },
  onReachBottom: function() {
    
    this.getCommentList();
    
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
   
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.picArr // 需要预览的图片http链接列表
    })
    
  },
})