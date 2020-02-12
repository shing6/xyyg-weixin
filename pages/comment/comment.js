 // pages/comment/comment.js
var Utils = require("../../utils/util.js");
const app = getApp();
const ctx = wx.createCanvasContext('myCanvas'); // 压缩图片

var datalist = {
  
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: [],
    startext: [],
    stardata: [1, 2, 3, 4, 5],
    score: 0,
    contentCount: 0, //正文字数
    content: '', //正文内容
    textareaFocus: true,                              // 文本域的自动调取键盘
    textareaVal: "",                                     // 文本域的val
    arrimg: [],           // 上传img的attr     => 页面显示的img                  
    len: 3,              // 上传的img的最大的length
    index: 0,         // 上传完成的个数
    successArr: [],      // 存储上传返回的img的url =>发送的数据
    questions: {},        // 提交数据存储到本地的josn
    bool: true,  // 是否通过上传的权限
    mun: 0,
    tempFilePath: "",
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    this.setData({
      goodsId: options.goodsId,
      orderId: options.orderId
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  // 五星评价事件

  changeColor(e) {

    var index = e.currentTarget.dataset.index;

    var num = e.currentTarget.dataset.no;

    var a = 'flag[' + index + ']';

    var b = 'startext[' + index + ']';

    var that = this;

    if (num == 1) {

      that.setData({

        [a]: 1,
        [b]: '非常差',
        score: 1

      });

    } else if (num == 2) {

      that.setData({

        [a]: 2,
        [b]: '差',
        score: 2,

      });

    } else if (num == 3) {

      that.setData({

        [a]: 3,
        [b]: '一般',
        score: 3

      });

    } else if (num == 4) {

      that.setData({

        [a]: 4,
        [b]: '满意',
        score: 4

      });

    } else if (num == 5) {

      that.setData({

        [a]: 5,
        [b]: '超赞',
        score: 5

      });

    }

  },
  /**
   * 发布评论
   */
  sumitComment() {
    var that = this;
    console.log(JSON.stringify(that.data.successArr) );
    if (that.data.score==0) {
      wx.showToast({
        title: '请打分',
        icon: 'none'
      })
      return;
    }
    if (that.data.content.length==0) {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.URL + '/comment/insertComment',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id'),
        score: that.data.score,
        successArr: that.data.successArr,
        goodsId: that.data.goodsId,
        content:that.data.content,
        orderId: that.data.orderId
      },
      success: (res) => {
        if (res.data.errno == 0){
          var pages = getCurrentPages();//当前页面栈

          if (pages.length > 1) {
            var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
            beforePage.changeData();//触发父页面中的方法
          }
          wx.navigateBack({
            delta: 1
          })
        }
      
        if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
        // this.setData({
        //   addressList: res.data,
        // })
      }
    })
  },
   /**
   * 计算输入评论的字数
   */
  handleContentInput(e) {
    let value = e.detail.value;
    
  //判断是否超过150个字符
    if (value && value.length > 150) {
      return false;
    }

    this.setData({
      content: value,
    })
  },

  chooseimage(e) {
   
      this.chooseImageFn();   // 上传的fn
  },
  chooseImageFn() {   // 上传的fn
    var _this = this;
    var len = _this.data.len;   // 获取data的上传的总个数
    var mun = _this.data.index;  // 获取data的上传完成的个数
    var arr = _this.data.arrimg;         // 获取data的img的list 
    var suArr = _this.data.successArr; // 存储上传返回的img的src
    // 调取手机的上传
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {       // 成功
        var tempFilePaths = res.tempFilePaths[0].toString();
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小
        if (tempFilesSize <= 10000000) {
          len == mun ? mun = 3 : mun++;
          if (_this.data.index <= 2) {// 上传之前的验证个数
            arr.push(tempFilePaths);
            _this.setData({
              arrimg: arr,
              index: mun
            })

            wx.uploadFile({   // 上传
              url: app.globalData.URL + '/file/upload',
              filePath: arr[arr.length - 1],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                // 返回上传完成的img的src
               
                var path = res.data;
                suArr.push(path);
               
                _this.setData({
                  successArr: suArr
                })
              }
               
            })
          }
          
         
        }
        else {
          wx.showToast({
            title: '上传图片不能大于10M',
            icon:'none'
          })
        }
        
      }
    })
  },

  /**
   * 删除图片
   */
  closeImgFn(e) {
    var doId = e.currentTarget.id;      // 对应的img的唯一id
    console.log(doId);
    var doarrimg = this.data.arrimg;    // 页面显示的img the list    
    var doindex = this.data.index;   // 上传显示的个数
    var suArr = this.data.successArr;      // 发送的img的list的数组
    doarrimg.splice(doId, 1);     // 删除当前的下标的数组
    suArr.splice(doId, 1);
    doindex--;       // 删除一个上传的个数就递减
    this.setData({
      arrimg: doarrimg,
      index: doindex,
      successArr: suArr
    })
  },
  getSetting() {  // 请求权限
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.record"]) {
          if (_this.data.bool) {
            wx.startRecord({
              success: function (res) {
                var tempFilePath = res.tempFilePath;
                _this.setData({
                  tempFilePath: tempFilePath
                })
              }
            })
            _this.setData({
              bool: false
            })
          } else {
            wx.stopRecord()
            _this.setData({
              bool: true
            })
          }

        }
      }
    })
  },

  previewImage: function (e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.arrimg // 需要预览的图片http链接列表
    })
  },


})