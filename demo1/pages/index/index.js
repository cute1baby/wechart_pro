const app = getApp()

Page({
  data: {
    number: 0,
    newObj: null
  },
  onLoad: function () {
    setInterval(() => {
      this.setData({
        number: Math.floor(Math.random() * 10) + 2,
        newObj: {
          a: Math.floor(Math.random() * 10) + 2,
          b: Math.floor(Math.random() * 10) + 2
        }
      })
    }, 5000)
  },
})
