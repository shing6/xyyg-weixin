// page/component/orders/orders.js
//获取应用实例
const app = getApp();
Page({
  _storageKeyName: 'cart',
  _storageKeyShopName:'shop',
  data:{
    address:{},
    count:0,
    hasAddress: false,
    total:0,
    sum:0,
    orders:[],
    totalList:[],
    imageUrl: app.globalData.URL,
    shopList:  [],
    orderNoList:[],
    showPayPwdInput: false,  //是否展示密码输入层
    pwdVal: '',  //输入的密码
    payFocus: true, //文本框焦点
    _storageKeyName: 'cart',
    formIdList :[],
    formId: [],
  },
  onLoad(options){
    this.getShopByIds(this.shopCallBack)
    //加载地址
    if (options.address){
      let address = JSON.parse(options.address)
      this.setData({
        address: address,
        hasAddress: true,
      })
    }
    else{
      this.getDefaultAddressById();
    }
   
    var cartData = this.getCartDataFromLocal(true);

    this.setData({
      orders: cartData,
    });
    if (this.data.address.latitude){
     
      let distance = this.distance(22.9787900000, 113.8406210000, this.data.address.latitude, this.data.address.longitude)
        
    this.setData({
       distance: distance
     })
     console.log();
    }
   
  },
  onReady() {
    
    // this.getTotalPrice();
    // this.getPrice();
  },
  
  onShow:function(){
    
  },

  /**
   * 计算每个商铺的商品总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let shopList = this.data.shopList;
    let totalList = this.data.totalList;
    let total=0;
    for(let i=0;i<shopList.length;i++){
       total = 0;
      for (let j = 0; j < orders.length; j++){
        if (orders[j].sellerId == shopList[i].id){
          if (orders[j].price>0){
            total += orders[j].price * orders[j].counts;
          }
          else{
            total += orders[j].oldPrice * orders[j].counts;
          }
           }
        }
        totalList.push(total);
    }
    this.setData({
      totalList: totalList
    })
  },

  /**
   * 计算总价
   */
  getPrice() {
    let orders = this.data.orders;
    let shopList = this.data.shopList;
    let total = 0;
    let freight=0;
    let sum = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].price>0){
        total += orders[i].counts * orders[i].price;
      }
      else{
        total += orders[i].counts * orders[i].oldPrice;
      }
     
    }
    for (let i = 0; i < shopList.length; i++) {
      freight += shopList[i].freight;
    }
    sum = total + freight;
     this.setData({
      sum: sum.toFixed(2)
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
        if (res[i].selected) {
          newRes.push(res[i]);
        }
      }
      res = newRes;
    }

    return res;
  },
  

  /**
  * 根据商店id查询商店信息
  */
  getShopByIds(callBack) {
    let data = this.getCartDataFromLocal();
    let sellerIdList = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].selected){
        sellerIdList.push(data[i].sellerId);
      }
    }

    let newList = this.removeDuplicatedItem(sellerIdList);
    this.setData({
      shopIdList: newList,
    })
   
    wx.request({
      url: app.globalData.URL + '/shop/getShopByIds',
      method: 'POST',
      data: {
        ids: newList,
      },
      header: {

        "Content-Type": "application/x-www-form-urlencoded"

      },
      success: (res) => {
        if (res.data.length!=0) {
         typeof callBack == "function" && callBack(res.data);
        }
      }
    })
    
  },
  /**
   * 查询商品信息回调函数
   */
  shopCallBack(res){
     this.setData({
        shopList:res,
     })
    this.getTotalPrice();
    this.getPrice();
  },
  /**
  * 数组去重
  */
  removeDuplicatedItem(arr) {
    var tmp = {},
      ret = [];

    for (let i = 0, j = arr.length; i < j; i++) {
      if (!tmp[arr[i]]) {
        tmp[arr[i]] = 1;
        ret.push(arr[i]);
      }
    }

    return ret;
  },
 /**
   * 获取地址
   */
  getDefaultAddressById: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL + '/address/getDefaultAddressById',
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        open_id: wx.getStorageSync('open_id')
      },
      success: (res) => {
        if (res.data.errno == 501) {
          wx.showToast({
            title: '请先登录',
            image: '/images/nav/icon_error.png'
          })
          url: '../../login/login'
        }
        if(res.data.length!=0){
          let distance=0;
          for(let i=0;i<that.data.shopList.length;i++){
             distance = that.distance(that.data.shopList[i].latitude, that.data.shopList[i].longitude, res.data.latitude, res.data.longitude);
            if (distance>5){
                   break;
            }
          }
         
          that.setData({
            address: res.data,
            hasAddress: true,
            distance: distance
          })
         
        }
        
      }
    })
  },
/**
 * 创建订单付款
 */
  toPay() {
    console.log(this.data.orders);
    var that=this;
    let _cart = wx.getStorageSync(that._storageKeyName);
    let orders = that.data.orders;
    let shopIdList = that.data.shopIdList;
    let formId = that.data.formId;
    let newOrderList = [];
     //创建订单，此时未付款
        wx.request({
            url: app.globalData.URL + '/order/createOrder',
            method: 'POST',
            header: {
               "content-type": "application/x-www-form-urlencoded"
              //'content-type': 'application/json' 

            },
           
            data: {
              open_id: wx.getStorageSync('open_id'),
              orders: JSON.stringify(orders),
              address: JSON.stringify(that.data.address),
              shopIdList: JSON.stringify(shopIdList),
              formId: JSON.stringify(formId),
            },
           
            success: (res) => {
              
              if (res.data.status==500) {
                wx.showToast({
                  title: res.data.message,
                  // image: '/images/nav/icon_error.png'
                  icon: 'none',

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
              else{
                that.setData({
                   orderNoList:res.data
                })
                //删除缓存中的商品
               
               that.deleteProducts();
                //发起支付
                that.showInputLayer();
              }
            }
          })
    },
/**
 * 取消支付
 */
  cancelPay(){
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
        url: app.globalData.URL + '/wallet/pay',
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },

        data: {
          open_id: wx.getStorageSync('open_id'),
          orderNoList: JSON.stringify(this.data.orderNoList),
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
            if (this.data.count<3){
              this.showInputLayer();
            }
            else{
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
 
  /*
      * 删除某些商品
      */
  delete(ids) {
    let _newShop=[];
    let _cart = wx.getStorageSync(this._storageKeyName);
    let _shop = wx.getStorageSync(this._storageKeyShopName);
    if (!(ids instanceof Array)) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);  //删除数组某一项
      }
    }
    //循环查询商铺是否还有商品，没有则删除缓存商铺信息
    for (let i = 0; i < _shop.length; i++) {
      for (let j = 0; j < cartData.length; j++) {
        if (_shop[i].id == _cart[j].sellerId) {
          _newShop.push(_shop[i]);
          console.log(11);
          break;
        }

      }
    }
    wx.setStorageSync('shop', _newShop);
    wx.setStorageSync('cart',cartData);
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

  //将已经下单的商品从购物车删除
  deleteProducts(){
    var ids = [], arr = this.data.orders;
    for (let i = 0; i < arr.length; i++) {
      ids.push(arr[i].id);
    }
    this.delete(ids);
  },
  
  /**
   * 获取formId
   */
  formSubmit: function (e) {
   if (e.detail.formId != 'the formId is a mock one') {
     var form = this.data.formIdList;
     form.push(e.detail.formId)
      this.setData({
        formId: form
      })
     if(form.length==6){
        this.toPay();
     }
    }
   
 },

  /**
   * 判斷兩點距離，la緯度，lo經度
   */
  distance: function (la1, lo1, la2, lo2) {

    var La1 = la1 * Math.PI / 180.0;

    var La2 = la2 * Math.PI / 180.0;

    var La3 = La1 - La2;

    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));

    s = s * 6378.137;

    s = Math.round(s * 10000) / 10000;

    s = s.toFixed(2);

    return s;

  },

})