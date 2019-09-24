import { request, setConfig } from './wx-promise-request';
const app = getApp();

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
}

// 微信登录接口，通过获取系统信息和employeeId获取用户信息的接口
const wx_login = (bastUrl) => {
  return new Promise(function (resolve, reject) {
    wx.getSystemInfo({
      success: (systemInfo) => {
        request({
          url: bastUrl + 'InterfaceApi/LearnMoreWX/getEmployeeById',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          data: {
            employeeId: wx.getStorageSync('LMKT_EMPLOYEEID') || '',
            appletVersion: systemInfo.SDKVersion,
            wxVersion: systemInfo.version
          },
          method: 'POST'
        }).then(res => {
          let data = res.data
          if (data.status == "200") {
            resolve(res)
            return
          }
          if (data.status == "1002" || data.status == "1003") {
            wx.showToast({
              icon: 'none',
              title: data.msg,
            })
          }
          reject(res)
        })
      }
    })
  })
}

// 封装请求接口【1002和1003状态下重新登录】
const req = (baseUrl, url, data, method, showLoadingStatus, call) => {
  return new Promise(function (resolve, reject) {
    if (showLoadingStatus) {
      wx.showNavigationBarLoading()  //在当前页面显示导航条加载动画
      wx.showLoading({  //显示loading提示框
        title: '加载中',
        mask: true
      })
    }
    if (call) {
      var callback = call
    }
    request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: { // 将employeeId带入接口的header中，后端对个人角色的标识进行验证
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': wx.getStorageSync('LMKT_EMPLOYEEID')
      }
    }).then(res => {
      if (showLoadingStatus) { //请求完成后取消loading效果
        wx.hideNavigationBarLoading();  //在当前页面隐藏导航条加载动画
        wx.hideLoading()  //隐藏loading提示框
      }
      if (res.statusCode == 200) {

        if (res.data.status == 1002 || res.data.status == 1003) {
          // 请求登陆
          wx_login(baseUrl)
          // 在用户登录过期后，需要回调更新页面状态
          callback && callback()
          return;
        }

        switch (res.data.status) {  //顺利发送
          case '200':
            resolve(res.data)
            break;
          default:
            if (res.data.msg) {
              wx.showToast({
                title: res.data.msg.toString(),
                icon: 'none',
                duration: 2000
              })
            }
        }
      }
    }).catch(error => {
      reject(error)
      if (!showLoadingStatus) {  //展示loading
        wx.hideNavigationBarLoading()
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  req: req,
  wx_login: wx_login
}



