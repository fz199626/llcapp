// pages/order/order.js
const app = getApp()

Page({
  data: {
    orderList: []
  },
  onLoad(options) {
    let that = this
    wx.request({
      url: app.globalData.api +'/order/my-order',
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        that.setData({
          orderList: res.data.data.items
        })
      }
    })
  }
})