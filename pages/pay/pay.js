// pages/pay/pay.js
const app = getApp()

Page({
  data: {
    isTakeOut: 1,
    orderAddress: [],
    payData: [],
    remarks: '需要打包/加料等'
  },
  payList(nowWay, orderAddress) { //订单商品列表和默认地址数据
    let that = this
    wx.request({
      url: app.globalData.api + '/order/freight-budget',
      method: 'POST',
      data: {
        nowWay: nowWay,
        orderAddress: orderAddress
      },
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        that.setData({
          payData: res.data.data,
          orderAddress: res.data.data.address
        })
      }
    })
  },
  onLoad(options) {
    let that = this
    if (options.orderAddress) {
      that.payList(2, options.orderAddress)
    } else {
      that.payList(2, 0)
    }
  },
  selfTaking() { //自取按钮
    let that = this
    that.payList(1, 0)
    that.setData({
      isTakeOut: false
    })
  },
  takeOut() { //外卖按钮
    let that = this
    let orderAddress
    if (that.data.orderAddress != '') {
      orderAddress = that.data.orderAddress[0].id
    } else {
      orderAddress = 0
    }
    that.payList(2, orderAddress)
    that.setData({
      isTakeOut: true
    })
  },
  selecAddress(){ //选择地址
    wx.navigateTo({
      url: '/pages/address/address?isPay=true'
    })
  },
  phoneCall() {//拨打商家电话
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneCall
    })
  },
  goRemarks() { //前往备注页面
    let remarks = this.data.remarks;
    wx.navigateTo({
      url: '/pages/remarks/remarks?remarks=' + remarks
    })
  },
  pay() { //订单支付
    let that = this
    let orderAddress
    if (that.data.orderAddress != '') {
      orderAddress = that.data.orderAddress[0].id
    } else {
      orderAddress = 0
    }
    wx.request({
      url: app.globalData.api + '/pay/wechat-pay',
      method: 'POST',
      data: {
        nowWay: that.data.payData.nowWay,
        orderAddress: orderAddress,
        distribution_fee: that.data.payData.fee,
        deliveryNo: that.data.payData.deliveryNo,
        order_num: that.data.payData.order_num,
        remarks: that.data.remarks
      },
      header: {
        'cookie': wx.getStorageSync("sessionid")
      },
      success(res) {
        let data = res.data.data
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': 'MD5',
          'paySign': data.paySign,
          'success'(res) {
            console.log('支付成功！')
            wx.switchTab({
              url: '/pages/order/order'
            })
          },
          'fail'(res) {
            console.log('支付失败！')
            wx.switchTab({
              url: '/pages/order/order'
            })
          }
        })
      }
    })
  }
})