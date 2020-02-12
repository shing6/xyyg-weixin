var zhenzisms = require('../../../utils/zhenzisms.js');
const app = getApp();
var commonCityData = require('../../../utils/city.js');
const phoneRexp = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    latitude:0,
    longitude:0,
    img:[],
    phone:"",
    hidden: true,
    btnValue: '获取验证码',
    btnDisabled: false,
    second:60,
    array: [],
    objectArray: [],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       this.getCategory();
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


  upimg: function () {
  let that =this;
    wx.chooseImage({

      success: function (res) {
       var tempFilePaths = res.tempFilePaths  //图片
       that.setData({
         img: tempFilePaths,
       })
        wx.uploadFile({
          url: app.globalData.URL + '/file/uploadShop', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file', //文件对应的参数名字(key)
          //formData: data,  //其它的表单信息
          success: function (res) {
            console.log(tempFilePaths[0]);
            that.setData({
              imgUrl: res.data
            })
          }

        })

      }

    })

  },
  previewImage: function (e) {
    let that=this;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.img // 需要预览的图片http链接列表
    })
  },
  /**
   * 删除图片
   */
  closeImgFn(){
      this.setData({
        img:null
      })
  },
  /**
   * 选择地址
   */
  chooseLocation() {
    var that = this;
    wx.chooseLocation({
      success: function (res) {

        that.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
        })

      },

    })
  },

  /**
   * 申请入驻
   */
  registerTap(e){
    var that = this;
    var shopName = e.detail.value.shopName;
    var address = e.detail.value.address;
    var detailAddr = e.detail.value.detailAddr;
    var img = that.data.img[0];
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var username = e.detail.value.username;
    var password = e.detail.value.password;
    var repassword = e.detail.value.repassword;
    var caregoryId = e.detail.value.caregoryId;
    var inCode = e.detail.value.inCode;
    var result = zhenzisms.client.validateCode(inCode);
    that.setData({
      phone: phone,
    })
    if (shopName == "") {
      wx.showModal({
        title: '提示',
        content: '请填写商铺名称',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请选择地址',
        showCancel: false
      })
      return
    }
    if (detailAddr == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (img == "") {
      wx.showModal({
        title: '提示',
        content: '请上传店面图',
        showCancel: false
      })
      return
    }
    if (name == "") {
      wx.showModal({
        title: '提示',
        content: '请填写姓名',
        showCancel: false
      })
      return
    }
    if (phone == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号',
        showCancel: false
      })
      return
    }
    
    if (phone) {
      if (!phoneRexp.test(phone)) {
        wx.showModal({
          title: '提示',
          content: '手机格式有误',
          showCancel: false
        })
        return
      }
    }
    if (inCode=="") {
      wx.showModal({
        title: '提示',
        content: '请输入验证码',
        showCancel: false
      })
      return
    }
    if(result=='error'){
      wx.showModal({
        title: '提示',
        content: '验证码不正确',
        showCancel: false
      })
      return
    }
    
    if (username == "") {
      wx.showModal({
        title: '提示',
        content: '请填写账号',
        showCancel: false
      })
      return
    }
    if (username.length < 6) {
      wx.showModal({
        title: '提示',
        content: '账号至少6位',
        showCancel: false
      })
      return
    }
    if (password == "") {
      wx.showModal({
        title: '提示',
        content: '请填写密码',
        showCancel: false
      })
      return
    }
    if (password.length<6) {
      wx.showModal({
        title: '提示',
        content: '密码至少6位',
        showCancel: false
      })
      return
    }
    if (password !=repassword) {
      wx.showModal({
        title: '提示',
        content: '两次密码不一致',
        showCancel: false
      })
      return
    }

   
    wx.request({
      url: app.globalData.URL + '/shop/insertShop/',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {

        shopName: shopName,
        address: address,
        detailAddr: detailAddr,
        imgUrl: that.data.imgUrl,
        name: name,
        phone: phone,
        username: username,
        password: password,
        caregoryId: caregoryId,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
      
      },

      success: function (res) {

        if (res.data.errno == 0) {
         
          wx.showToast({
            title: '已提交管理员审核',
            image: 'none'
          })
          that.setData({
             shopName :'',
             address : '',
             detailAddr : '',
             img : '',
             name : '',
             phone : '',
             username : '',
             password : '',
             repassword : '',
             caregory : '',
             inCode : '',
          })
           wx.navigateTo({
             url: '/pages/registerResult/registerResult',
           })
        }
        else if (res.data.errno == -1) {
          wx.showToast({
            title: '入驻失败',
            image: '/images/nav/icon_error.png'
          })
        }
        else if (res.data.errno == 510) {
          wx.showToast({
            title: '用户名已存在',
            image: '/images/nav/icon_error.png'
          })
        }

        
      }
    })
     
  },
  //获取短信验证码
  getCode(e) {
    if (this.data.phone) {
      if (!phoneRexp.test(this.data.phone)) {
        wx.showModal({
          title: '提示',
          content: '手机格式有误',
          showCancel: false
        })
        return
      }
    }
    var that = this;
    that.getPhone();
    
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  //手机号输入
  bindPhoneInput(e) {
    var val = e.detail.value;
    this.setData({
      phone: val
    })
    if (val != '') {
      this.setData({
        hidden: false,
        btnValue: '获取验证码'
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  //获取分类
  getCategory() {
    wx.request({
      url: app.globalData.URL + '/category/getShopCategory',
      success: (res) => {
       
        var array=[];
       
        for(let i=0;i<res.data.length;i++){
          array.push(res.data[i].name)
        }
        this.setData({
          objectArray: res.data,
          array:array,
        });
      }
    })

  },

  bindPickerChange: function (e) {
    console.log(e)
    this.setData({
      index: e.detail.value
    })
  },

  getPhone(){
    let that = this;
    wx.request({
      url: app.globalData.URL + '/user/getPhone',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        phone: that.data.phone
      },
      success: (res) => {
        if (res.data.errno == 0) {
          wx.showModal({
            title: '提示',
            content: '该手机已注册',
            showCancel: false
          })
         return;
         
        }

        else if (res.data.errno == -1){
          if (that.data.btnDisabled) {
            return;
          }
          that.setData({
            btnDisabled: true
          })
          zhenzisms.client.init('https://sms_developer.zhenzikj.com', '100861', '8419db37-1168-41b2-957d-9ca46863c994');
          zhenzisms.client.sendCode(function (res) {
            if (res.data.code == 0) {
              that.timer();
              return;
            }
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 2000
            })
          }, that.data.phone, '您的登录验证码是:{code}（5分钟内有效），请勿泄漏给他人。如非本人操作，请忽略本条消息！', 10001, 300, 6);
        }
      }
    })
  }

       
})