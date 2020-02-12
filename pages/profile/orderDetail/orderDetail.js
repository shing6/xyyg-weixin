
const app = getApp()
Page({
  data: {
    orderId: 0,
    count:0,
    orderInfo: {},
    orderGoods: [],
    expressInfo: {},
    flag: false,
    handleOption: {},
    imageUrl: app.globalData.URL,
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
       orderId: options.id
    });
   
   
    this.getOrderDetail();
  },
  changeData: function () {
    this.getOrderDetail();
  },

  onPullDownRefresh() {
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderDetail();
    // wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  expandDetail: function() {
    let that = this;
    this.setData({
      flag: !that.data.flag
    })
  },

  getOrderDetail: function() {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function() {
      wx.hideLoading()
    }, 2000);

    let that = this;
    wx.request({
      url: app.globalData.URL + '/order/getOrderDetailById',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id'),
        orderId: that.data.orderId,
      },
      success: function (res) {
        if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          wx.redirectTo({
            url: "/pages/login/login"
          });
        }
        else{
          var timestamp = Date.parse(new Date());
          var retime = timestamp - res.data.sendTime;
          var newtime = that.formatDuring(retime - 24 * 60 * 60 * 1000)
         
          that.setData({
            orderInfo: res.data,
            address: JSON.parse(res.data.snapAddr),
            newtime: newtime,
          });
          wx.hideLoading();
          
        }
      
       }
    })
   
  },
  /**
   * 去付款
   */
  payOrder: function() {
   let that = this;
    //发起支付
    that.showInputLayer();
  },
  /**
 * 取消支付
 */
  cancelPay() {
    wx.redirectTo({
      url: '/pages/payResult/payResult?status=0'
    })
  },


  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    this.setData({
      showPayPwdInput: true,
      payFocus: true
    });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: ''
    },
      function () {

      });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({ payFocus: true });
  },
  /**
   * 输入密码监听,满6位发起支付
   */
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      this.data.count++;
      this.hidePayLayer();
      wx.request({
        url: app.globalData.URL + '/wallet/secondPay',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },

        data: {
          open_id: wx.getStorageSync('open_id'),
          orderNo: this.data.orderInfo.orderNo,
          pwdVal: e.detail.value
        },

        success: (res) => {

          if (res.data.status == 500) {
            wx.showToast({
              title: res.data.message,
              image: '/images/nav/icon_error.png'
            })
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=0'
            })
          }
          else if (res.data.errno == 509) {
            wx.showToast({
              title: '支付密码错误',
              image: '/images/nav/icon_error.png'

            })
            if (this.data.count < 3) {
              this.showInputLayer();
            }
            else {
              wx.redirectTo({
                url: '/pages/payResult/payResult?status=0'
              })
            }


          }

          else if (res.data.errno == 501) {
            wx.showToast({
              title: '请先登录',
              image: '/images/nav/icon_error.png'
            })
            url: '../../login/login'
          }
          else {
            wx.redirectTo({
              url: '/pages/payResult/payResult?status=1'
            })
          }
        }
      })

    }
  },
 
  // “取消订单并退款”点击效果
  refundOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/wallet/applyRefund',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              open_id: wx.getStorageSync('open_id'),
              orderNo: that.data.orderInfo.orderNo,
            },
            success: function (res) {
              if (res.data.errno == 501) {
                wx.showToast({
                  title: '请先登录',
                  image: '/images/nav/icon_error.png'
                })
                wx.redirectTo({
                  url: "/pages/login/login"
                });
              }
              else if (res.data.errno ==0){
                wx.showToast({
                  title: '申请成功',
                  
                })
                that.getOrderDetail();
              }

            }
          })
        }
      }
    });
  },
 
  // “确认收货”点击效果
  confirmOrder: function() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/order/takeGoods',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },

            data: {
              open_id: wx.getStorageSync('open_id'),
              orderNo: that.data.orderInfo.orderNo,
            },

            success: (res) => {

              if (res.data.status == 500) {
                wx.showToast({
                  title: res.data.message,
                  image: '/images/nav/icon_error.png'
                })
              }
              else if (res.data.errno == -1) {
                wx.showToast({
                  title: '未知错误',
                  image: '/images/nav/icon_error.png'
                })

              }

              else if (res.data.errno == 501) {
                wx.showToast({
                  title: '请先登录',
                  image: '/images/nav/icon_error.png'
                })
                url: '../../login/login'
              }
              else if (res.data.errno==0){
                that.getOrderDetail();
              }
            }
          })
        }
      }
    });
  },
   /**
    * 取消订单
    */
  cancelOrder(e){
    let that = this;
    let orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '',
      content: '确认取消订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/order/updateOrderStaus',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },

            data: {
              open_id: wx.getStorageSync('open_id'),
              orderId: orderId,
              status:9,
            },

            success: (res) => {

              if (res.data.status == 500) {
                wx.showToast({
                  title: res.data.message,
                  image: '/images/nav/icon_error.png'
                })
              }
              else if (res.data.errno == -1) {
                wx.showToast({
                  title: '未知错误',
                  image: '/images/nav/icon_error.png'
                })

              }

              else if (res.data.errno == 501) {
                wx.showToast({
                  title: '请先登录',
                  image: '/images/nav/icon_error.png'
                })
                url: '../../login/login'
              }
              else if (res.data.errno == 0) {
                that.getOrderDetail();
              }
            }
          })
        }
      }
    });
  },

  /**
   * 删除订单
   */
  deleteOrder(e){
    let that = this;
    let orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '',
      content: '确认删除订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/order/deleteOrder',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },

            data: {
              open_id: wx.getStorageSync('open_id'),
              orderId: orderId,
            },

            success: (res) => {

              if (res.data.status == 500) {
                wx.showToast({
                  title: res.data.message,
                  image: '/images/nav/icon_error.png'
                })
              }
              else if (res.data.errno == -1) {
                wx.showToast({
                  title: '未知错误',
                  image: '/images/nav/icon_error.png'
                })

              }

              else if (res.data.errno == 501) {
                wx.showToast({
                  title: '请先登录',
                  image: '/images/nav/icon_error.png'
                })
                url: '../../login/login'
              }
              else if (res.data.errno == 0) {
                wx.redirectTo({
                  url: '/pages/profile/order/order'
                })
              }
            }
          })
        }
      }
    });
  },
  //联系商家
  callSeller(){
     let id=this.data.orderInfo.sellerId;
    wx.request({
      url: app.globalData.URL + '/user/getPhoneBySellerId',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },

      data: {
        id: id,
      },

      success: (res) => {
        wx.makePhoneCall({
          phoneNumber: res.data+""
        })
      }
    })
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
 
  formatDuring(mss){
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return days + " 天 " + Math.abs(hours) + " 小时 " + Math.abs(minutes) + " 分钟 ";
  }
});