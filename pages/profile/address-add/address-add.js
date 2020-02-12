var commonCityData = require('../../../utils/city.js')
const phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
//获取应用实例
var app = getApp()
Page({
  data: {
    address:null,
    addressData:false,
    latitude:0,
    longitude:0,
    isDefault:0,
  },
 /**
  * 保存地址
  */
  bindSave: function (e) {
   console.log(e);
    
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var detailAddress = e.detail.value.detailAddress;
    var mobile = e.detail.value.mobile;
    console.log(that.data.isDefault);

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (mobile) {
      if (!phoneRexp.test(mobile)) {
        wx.showModal({
          title: '提示',
          content: '手机格式有误',
          showCancel: false
        })
        return
       }
     }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请选择地址',
        showCancel: false
      })
      return
    }
    if (detailAddress == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
   
   
    
    var apiAddoRuPDATE = "add";
    if (that.data.id) {
      apiAddoRuPDATE = "update";
      var apiAddid = that.data.id;
      
    } else {
      apiAddid = null;
    }
    
    wx.request({
      url: app.globalData.URL + '/address/' + apiAddoRuPDATE,
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
       
          id: apiAddid,
          linkMan: linkMan,
          address: address,
          detailAddress: detailAddress,
          mobile: mobile,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          isDefault: that.data.isDefault,
          open_id: wx.getStorageSync('open_id'),
         
      },
      
      success: function (res) {
        
         if (res.data.errno == 0) {
           wx.navigateBack({
             delta: 1
           })
        }
        else if (res.data.errno == 507) {
          wx.showToast({
            title: '添加地址失败',
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

         else if (res.data.errno == 505) {
           wx.showToast({
             title: '修改地址失败',
             image: '/images/nav/icon_error.png'
           })
           url: '../../login/login'
         }
       }
    })
  },

 
  
  
  onLoad: function (e) {
    
    //加载地址
    if (e.address) {
      let address = JSON.parse(e.address)
      this.setData({
        id: address.id,
        linkMan: address.name,
        mobile: address.mobile,
        address: address.address,
        detailAddress: address.detailAddr,
        latitude: address.latitude,
        longitude: address.longitude,
        addressData:true,
      })

    }
  },
  
  
  deleteAddress(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL + '/address/deleteAddressById',
            method: 'POST',
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              open_id: wx.getStorageSync('open_id'),
              id: id
            },
            success: (res) => {
              if (res.data.errno == 0) {
                wx.navigateBack({
                  delta: 1
                })
              }
              else if (res.data.errno == -1) {
                wx.showToast({
                  title: '删除失败',
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
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
         
        }
      }
    })
  },
  readFromWx(){
    let that = this;
    wx.chooseAddress({
      success: function (res) {
       
        that.setData({
          wxaddress: res,
        });
      }
    })
  },

  
  chooseLocation(){
    var that = this;
    wx.chooseLocation({
        success: function(res) {
         
          that.setData({
            address: res.address,
            latitude:res.latitude,
            longitude:res.longitude,
          })
          
        },
        
      })
  },
  /**
   * 设置默认地址,1为默认
   */
  switchChange(e){
    if(e.detail.value){
       this.setData({
         isDefault:1
       })
     }

    else if (!e.detail.value) {
      this.setData({
        isDefault: 0
      })
    }
  }
})
