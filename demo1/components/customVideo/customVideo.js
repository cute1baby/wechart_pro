// components/customVideo.js
import { formatTime, throttle } from '../../utils/util.js';
let timer = null;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoInfo: {
      type: Object
    },
    continuity:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTime: 0,  //保存观看视频的进度
    startTime: 0,  //保存视频开始时间
    endTime: 0,  //保存视频结束时间

    progressStatus: true,  //进度模块状态
    progressTime: "00:00",  //保存观看视频的进度
    allTime: "00:00",
    index: null, // 默认倍率为1
    sliderValue: 0, //控制进度条slider的值，
    updateState: false, //防止视频播放过程中导致的拖拽失效
    playStates: true, //控制播放 & 暂停按钮的显示
    fullStates: false, //控制是否要显示全屏状态
    magnificationList: ["0.5X", "1X", "1.25X", "1.5X"]  //倍率的选择数组
  },


  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  ready: function () {
    let { magnificationList} = this.data;
    const _this = this;
    this.videoContext = wx.createVideoContext('myVideo', this);
    // 获取微信小程序版本号，控制倍率的选择
    wx.getSystemInfo({
      success: function(res){
        if (res.SDKVersion >= "2.6.3"){
          _this.setData({
            magnificationList: [...magnificationList, "2X"]
          })
        }
      }
    })
    this.setData({
      updateState: true
    })
    this.setTimerProgressStatus();
  },

  /**组件所在的页面被隐藏时执行 */
  hide: function () {
    this.videoContext.pause();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 动态监听切换全屏状态
    fullscreenchange: function (e) {
      this.setData({
        fullStates: e.detail.fullScreen,
        progressStatus: true  //切换之后默认显示进度模块
      }, () => {
        this.setTimerProgressStatus();
      })
    },

    // 重新播放时对速率的监听（解决重新播放速率不匹配的问题）
    videoPlay: function(){
      const { magnificationList, index} = this.data;
      const rate = index ? magnificationList[index] : magnificationList[1];
      this.videoContext.playbackRate(parseFloat(rate));
    },

    //监听视频停止播放
    videoEnded: function () {
      const { continuity, playStates} = this.data;
      this.setData({
        playStates: !playStates
      })
      if (continuity) {
        this.triggerEvent('myend', {})
      }

    },



    // 发送数据给后端存储
    updataToBackground: function (module) {
      const createTime = formatTime(new Date());
      const { startTime, endTime } = module;
      this.triggerEvent('myevent', { createTime, startTime, endTime})
    },


    setTimerProgressStatus: function () {

      const { progressStatus } = this.data;
      if (timer) {
        clearTimeout(timer);
      }
      if (progressStatus) {
        timer = setTimeout(() => {
          this.setData({
            progressStatus: false
          })
        }, 5000)
      }

    },

    videoUpdate: function (e) {
      this.throttleProgress({_this: this, e});
    },

    throttleProgress: throttle(({_this, e}) => {
      function formatterNum(num) {
        return parseInt(num) < 10 ? "0" + parseInt(num) : parseInt(num);
      }
      if (_this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
        let sliderValue = e.detail.currentTime / e.detail.duration * 100;
        const progressTime = formatterNum(e.detail.currentTime / 60) + ":" + formatterNum(e.detail.currentTime % 60)
        const allTime = formatterNum(e.detail.duration / 60) + ":" + formatterNum(e.detail.duration % 60)
        _this.setData({
          sliderValue,
          duration: e.detail.duration,
          progressTime,
          currentTime: e.detail.currentTime,
          allTime
        })
      }
    }),

    sliderChanging: function (e) {
      clearTimeout(timer);  //拖动的时候清除计时器，结束后重新计算消失时间
      this.setData({
        updateState: false, //拖拽过程中，不允许更新进度条

      })
    },
    sliderChange: function (e) {
      const { startTime, currentTime, playStates } = this.data;
      // 如果播放状态下拖动进度条，则重新保存一次
      if (playStates){
        this.setData({   //存储当前时间变化
          endTime: currentTime
        })
        // 提交一遍数据
        this.updataToBackground({ startTime, endTime: currentTime });
      }

      setTimeout(() => {
        //完成拖动后，计算对应时间并跳转到指定位置
        if (this.data.duration) {
          const rateTime = e.detail.value / 100 * this.data.duration;
          this.videoContext.seek(rateTime);
          this.setTimerProgressStatus(); //拖动完成之后可以让进度条模块隔5秒消失
          this.setData({
            sliderValue: e.detail.value,
            startTime: rateTime,  //开始时间也变成当前滚动条对应的时间
            currentTime: rateTime,  //当前时间为拖动后滚动条对应时间
            updateState: true //完成拖动后允许更新滚动条
          })
        }
      }, 0)

    },

    // 切换播放暂停状态
    videoOpreation: function (e) {
      const { startTime, playStates, currentTime } = this.data;

      if (playStates) {  //暂停
        this.videoContext.pause();
        this.setData({   //存储当前时间变化
          endTime: currentTime
        })
        // 保存一遍数据
        this.updataToBackground({ startTime, endTime: currentTime });
      } else {
        this.videoContext.play();
        this.setData({   //存储当前时间变化
          startTime: currentTime
        })
      }
      this.setData({
        playStates: !playStates
      },() => {
        this.setTimerProgressStatus();  //重新计算显示时间
      })

    },

    // 切换全屏状态
    changeFullScreen: function (e) {
      const { fullStates } = this.data;
      fullStates ? this.videoContext.exitFullScreen() : this.videoContext.requestFullScreen({
        direction: 90
      });
      this.setData({
        fullStates: !fullStates,
        progressStatus: true  //切换之后默认显示进度模块
      }, () => {
        this.setTimerProgressStatus();
      })
    },

    // 切换倍率
    bindPickerChange: function (e) {
      const { magnificationList } = this.data;
      this.setData({
        index: e.detail.value
      },() => {
        this.setTimerProgressStatus();  //重新计算显示时间
      })
      this.videoContext.playbackRate(parseFloat(magnificationList[e.detail.value]))
    },

    //切换进度模块的状态
    changeProgressStatus: function () {
      const { progressStatus } = this.data;
      this.setData({
        progressStatus: !progressStatus
      }, () => {
        this.setTimerProgressStatus();
      })

    },

    videoErrorCallback: function (e) {
    }



  }
})
