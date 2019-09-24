//api.js是为app.js而准备的
import { wx_login } from '/utils/api.js'
import { navgationInfo } from '/utils/navgation-info.js'
import * as config from '/utils/config.js';
App({
  onLaunch: function () {
    const that = this

    // 存储手机型号[兼容iphoneX且设置导航]
    wx.getSystemInfo({
      success: (res) => {
        that.globalData.systemInfo = res
        if (res.model.indexOf('iPhone X') >= 0) {
          that.globalData.isIphoneX = true
        }

        // 判断当前环境，填写baseUrl
        that.globalData.bastUrl = res.platform == 'devtools' ? 'https://sslapi3.ichazuo.cn/' : 'https://sslapi3.ichazuo.cn/'
        // 设置导航高度
        navgationInfo(that, res)
      }
    })

    // 登录
    wx.login()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              let userInfo = res.userInfo
              this.globalData.userInfo['nickName'] = userInfo.nickName
              this.globalData.userInfo['avatar'] = userInfo.avatarUrl


              // 默认登录
              let LMKT_EMPLOYEEID = wx.getStorageInfoSync('LMKT_EMPLOYEEID')
              LMKT_EMPLOYEEID && that.getUser()
            }
          })
        }
      }
    })
  },
  onShow: function () {
    console.log("login --- show");
  },
  getUser: function () {
    wx_login(this.globalData.bastUrl).then(res => {
      let data = res.data.data
      this.globalData.userInfo['companyName'] = data.company_name || '';
      this.globalData.userInfo['companyId'] = data.company_id || '';
      this.globalData.userInfo['employeeId'] = data.employee_id || '';
      this.globalData.userInfo['unionid'] = data.unionid || '';
      this.globalData.userInfo['avatar'] = data.avatar;
      this.globalData.userInfo['mobile'] = data.mobile;
      this.globalData.userInfo['nickName'] = data.wx_name;
      this.globalData.userInfo['name'] = data.name;
      this.globalData.userInfo['catalogId'] = data.catalog_id;
      // 用户身份
      if (data.own_member) {
        // role  角色类型(1上级 2中基层 3下属 )
        this.globalData.userInfo['role'] = data.own_member.role
        this.globalData.userInfo['trainId'] = data.own_member.train_id
        this.globalData.userInfo['teamId'] = data.own_member.team_id
      }
      // 存储用户登录状态
      data.employee_id && wx.setStorageSync('LMKT_EMPLOYEEID', data.employee_id);

      // 储存信件信息
      this.globalData.letter = {};
      this.globalData.letter['noticeContent'] = data.notice_content;
      this.globalData.letter['noticeTitle'] = data.notice_title;
      this.globalData.letter['noticeId'] = data.notice_id;

      // 更新登录状态
      if (!this.globalData.isLogin) {
        this.globalData.isLogin = true
      }

      this.readyCallback(this.globalData.userInfo)
    }).catch(err => {
      // 无登录记录
      this.readyCallback();
      console.log(err.data.msg)
    })
  },
  readyCallback: function (res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  },

  /**存储在全局的对象值 */
  globalData: {
    visitorId: 35,  // 游客id
    userInfo: {},
    isLogin: false
  },
  config: { ...config }
})