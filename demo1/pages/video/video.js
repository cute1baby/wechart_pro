// pages/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoInfo:{
      playAddress: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
      courseName: "这是测试自定义视频的一个标题",
      cover: "http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  submissSchedule:function(){
    console.log("保存数据到数据库");
  },

  jumpToNext: function(){
    wx.navigateTo({
      url: `/pages/index/index`
    })
  }
})