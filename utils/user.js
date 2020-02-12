

/**
 * Promise封装wx.checkSession
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装wx.login
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  return new Promise(function (resolve, reject) {
    return login().then((res) => {
     
     
      wx.setStorageSync('userInfo', userInfo);
      //登录远程服务器
      wx.request({
        
        url: 'https://shing6.cn:8081/user/wxLogin',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          code: res.code,
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        },
        success: function (res) {
        
          const userInfo = res.data.object
          // 将返回的数据保存到全局的缓冲中，方便其他页面使用
         
          wx.setStorageSync('open_id', res.data.open_id);
          resolve(res);
         }
        
      })
     
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('open_id')) {
      checkSession().then(() => {
        resolve(true);
       
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

module.exports = {
  loginByWeixin,
  checkLogin,
};